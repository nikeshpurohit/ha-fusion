const RESIZE_START_EVENT_NAME = "resizeStart";
const RESIZE_END_EVENT_NAME = "resizeEnd";

const RESIZE_BOUNDARY_THRESHOLD = 10;

import type { ActionReturn } from 'svelte/action';

export interface ResizeOptions {
	resizable: boolean;
	resizeOverlay: HTMLElement | null;

	maxColSpan?: number;
}

export interface ResizeEvent {
	target: HTMLElement;
	newColSpan?: number;
}

export interface ResizeAttributes {
	"on:resizeStart"?: (event: CustomEvent<ResizeEvent>) => void;
	"on:resizeEnd"?: (event: CustomEvent<ResizeEvent>) => void;
}

export function resizeAction(
	node: HTMLElement,
	options: ResizeOptions
): ActionReturn<ResizeOptions, ResizeAttributes> {
	let initialMouseX = 0;
	let initialWidth = 0;
	let columnWidth = calculateColumnWidth();
	let columnGap = calculateColumnGap();

	let resizeTarget: HTMLElement | null = null;

	let currentOptions = options;

	function calculateColumnWidth(): number {
		// Find the closest grid container (assumes the parent is the grid container)
		const gridContainer = node.parentElement;
		if (gridContainer) {
			const gridStyle = getComputedStyle(gridContainer);
			const columns = gridStyle.gridTemplateColumns.split(' '); // Get column definitions
			if (columns.length > 0) {
				return parseFloat(columns[0]); // Return the width of the first column
			}
		}
		// Default column width if no grid is found
		return 150;
	}

	function calculateColumnGap(): number {
		// Find the closest grid container (assumes the parent is the grid container)
		const gridContainer = node.parentElement;
		if (gridContainer) {
			const gridStyle = getComputedStyle(gridContainer);
			const columnGap = gridStyle.columnGap;
			if (columnGap) {
				return parseFloat(columnGap);
			}
		}
		// Default column gap if no grid is found
		return 0;
	}

	function setResizeTarget(target: HTMLElement | null) {
		if (!target) {
			resizeTarget = null;
			return;
		}

		resizeTarget = target;
	}

	function dispatchEvent(name: string, detail: any) {
		node.dispatchEvent(new CustomEvent(name, { detail }));
	}

	function handleGlobalMouseMove(event: MouseEvent) {
		if (!currentOptions.resizable) return;

		requestAnimationFrame(() => {
			if (!resizeTarget) {
				return;
			}

			const rect = resizeTarget.getBoundingClientRect();
			const deltaX = event.clientX - initialMouseX;
			const borderWidth = Math.max(initialWidth + deltaX, columnWidth); // Minimum virtual width

			const resizeGridSpan = Math.min(
				Math.max(1, Math.ceil((event.clientX - rect.left) / columnWidth)), // At least 1 column
				currentOptions.maxColSpan || Infinity // Enforce maxColSpan if provided
			);
			const currentResizeSpan =
				parseInt(resizeTarget.style.gridColumn.replace('span ', ''), 10) || 1;

			if (resizeGridSpan !== currentResizeSpan) {
				resizeTarget.style.gridColumn = `span ${resizeGridSpan}`;
			}

			// Optionally update the overlay dynamically for visual feedback
			updateResizeOverlay(borderWidth, rect);
		});
	}

	function handleNodeMouseMove(event: MouseEvent) {
		if (!currentOptions.resizable) return;

		const target = event.target as HTMLElement;

		const rect = node.getBoundingClientRect();
		const isRightEdge = event.clientX > rect.right - RESIZE_BOUNDARY_THRESHOLD && event.clientX < rect.right;

		target.style.cursor = isRightEdge ? 'ew-resize' : '';
	}

	function captureNodeClick(event: MouseEvent) {
		event.stopPropagation();
		node.removeEventListener('click', captureNodeClick, true);
	}

	function handleMouseDown(event: MouseEvent) {
		if (!currentOptions.resizable) return;
		event.stopPropagation();

		const rect = node.getBoundingClientRect();
		if (event.clientX >= rect.right - RESIZE_BOUNDARY_THRESHOLD) {
			calculateColumnWidth(); // Ensure the column width is up-to-date
			initialMouseX = event.clientX;
			initialWidth = rect.width;
			setResizeTarget(node);

			window.addEventListener('mousemove', handleGlobalMouseMove);
			document.body.style.cursor = 'ew-resize';

			dispatchEvent(RESIZE_START_EVENT_NAME, { target: node });

			updateResizeOverlay(initialWidth, rect);
		}
	}

	function handlePointerUp() {
		if (resizeTarget !== null) {
			window.removeEventListener('mousemove', handleGlobalMouseMove);
			node.addEventListener('click', captureNodeClick, true);
			document.body.style.cursor = 'default';

			dispatchEvent(RESIZE_END_EVENT_NAME, {
				target: node,
				newColSpan: Math.min(
					parseInt(resizeTarget.style.gridColumn.replace('span ', ''), 10),
					currentOptions.maxColSpan || Infinity
				)
			});

			const { resizeOverlay } = currentOptions;

			if (resizeOverlay !== null) {
				resizeOverlay.style.display = 'none';
			}

			setResizeTarget(null);
		}
	}

	function updateResizeOverlay(width: number, rect: DOMRect) {
		const { resizeOverlay, maxColSpan } = currentOptions;

		if (resizeOverlay) {
			// Calculate the maximum allowed width based on maxColSpan
			const maxWidth = maxColSpan
				? maxColSpan * columnWidth + (maxColSpan - 1) * columnGap
				: Infinity;

			// Clamp the width to respect maxColSpan
			const clampedWidth = Math.min(width, maxWidth);

			resizeOverlay.style.display = 'block';
			resizeOverlay.style.left = `${rect.left}px`;
			resizeOverlay.style.top = `${rect.top}px`;
			resizeOverlay.style.width = `${clampedWidth}px`;
			resizeOverlay.style.height = `${rect.height}px`;
		}
	}

	node.addEventListener('mousemove', handleNodeMouseMove);
	node.addEventListener('mousedown', handleMouseDown);
	window.addEventListener('mouseup', handlePointerUp);

	return {
		update(newOptions: {
			resizable: boolean;
			resizeOverlay: HTMLElement | null;
		}) {
			currentOptions = newOptions;
			columnWidth = calculateColumnWidth();
			columnGap = calculateColumnGap();
		},
		destroy() {
			node.removeEventListener('mousemove', handleNodeMouseMove);
			node.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handlePointerUp);
		}
	};
}
