import {
	memo,
	useState,
	createElement,
	useRef,
	useEffect,
	RawHTML,
} from '@wordpress/element'
import { __ } from 'ct-i18n'

import { list, grid } from '@wordpress/icons'

import classnames from 'classnames'

import { useSelect } from '@wordpress/data'
import { PanelBody, Spinner, ToolbarGroup } from '@wordpress/components'

import {
	InspectorControls,
	useInnerBlocksProps,
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	store as blockEditorStore,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor'

import { usePostsBlockData } from '../query/hooks/use-posts-block-data'
import RangeControl from '../../components/RangeControl'

const TEMPLATE = [
	// ['core/post-title'],
	// ['core/post-date'],
	// ['core/post-excerpt'],
]

function PostTemplateInnerBlocks() {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-post' },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	)

	return <article {...innerBlocksProps} />
}

function PostTemplateBlockPreview({
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
}) {
	const blockPreviewProps = useBlockPreview({
		blocks,
		props: {
			className: 'wp-block-post',
		},
	})

	const handleOnClick = () => {
		setActiveBlockContextId(blockContextId)
	}

	const style = {
		display: isHidden ? 'none' : undefined,
	}

	return (
		<article
			{...blockPreviewProps}
			tabIndex={0}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={handleOnClick}
			onKeyPress={handleOnClick}
			style={style}
		/>
	)
}

const MemoizedPostTemplateBlockPreview = memo(PostTemplateBlockPreview)

const Edit = ({
	clientId,

	className,

	attributes,
	attributes: { layout, verticalAlignment },

	setAttributes,

	context,
	__unstableLayoutClassNames,
}) => {
	const { postId, postType } = context

	const [activeBlockContextId, setActiveBlockContextId] = useState()

	const { type: layoutType, columnCount = 3 } = layout || {}
	const isGridLayout = layoutType === 'grid'
	const isManualMode = columnCount !== null

	const blockProps = useBlockProps({
		className: classnames(__unstableLayoutClassNames, {
			'ct-query-template-grid': isGridLayout,
			'ct-query-template-list': !isGridLayout,
		}),
		style: isGridLayout
			? {
					...(isManualMode
						? {
								'grid-template-columns': `repeat(var(--ct-grid-columns, ${columnCount}), minmax(0, 1fr))`,
								'--ct-grid-columns-tablet': `${attributes.tabletColumns}`,
								'--ct-grid-columns-mobile': `${attributes.mobileColumns}`,
						  }
						: {}),

					...(verticalAlignment
						? {
								'align-items':
									verticalAlignment === 'top'
										? 'flex-start'
										: verticalAlignment === 'bottom'
										? 'flex-end'
										: 'center',
						  }
						: {}),
			  }
			: {},
	})

	const { blockData } = usePostsBlockData({
		attributes: context,
		previewedPostId: postId,
	})

	const { blocks } = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore)

			return {
				blocks: getBlocks(clientId),
			}
		},
		[clientId]
	)

	if (!blockData) {
		return (
			<p {...blockProps}>
				<Spinner />
			</p>
		)
	}

	let blockContexts = blockData.all_posts.map((post) => ({
		postId: post.ID,
		postType: post.post_type,
	}))

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		})

	const displayLayoutControls = [
		{
			icon: list,
			title: __('List view'),
			onClick: () => setDisplayLayout({ type: 'default' }),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: __('Grid view'),
			onClick: () =>
				setDisplayLayout({
					type: 'grid',
					columnCount,
				}),
			isActive: isGridLayout,
		},
	]

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={displayLayoutControls} />

				{isGridLayout ? (
					<BlockVerticalAlignmentToolbar
						onChange={(newVerticalAlignment) => {
							setAttributes({
								verticalAlignment: newVerticalAlignment,
							})
						}}
						value={verticalAlignment}
					/>
				) : null}
			</BlockControls>

			<InspectorControls>
				{isGridLayout && isManualMode ? (
					<>
						<PanelBody>
							<RangeControl
								attributes={attributes}
								label={__(
									'Tablet Columns',
									'blocksy-companion'
								)}
								onChange={(columns) =>
									setAttributes({
										tabletColumns: columns,
									})
								}
								initialPosition={attributes?.tabletColumns}
								value={attributes?.tabletColumns}
							/>
						</PanelBody>
						<PanelBody>
							<RangeControl
								attributes={attributes}
								label={__(
									'Mobile Columns',
									'blocksy-companion'
								)}
								onChange={(columns) =>
									setAttributes({
										mobileColumns: columns,
									})
								}
								initialPosition={attributes?.mobileColumns}
								value={attributes?.mobileColumns}
							/>
						</PanelBody>
					</>
				) : null}
			</InspectorControls>

			<div {...blockProps}>
				{blockContexts.map((blockContext) => (
					<BlockContextProvider
						key={blockContext.postId}
						value={blockContext}>
						{blockContext.postId ===
						(activeBlockContextId || blockContexts[0]?.postId) ? (
							<PostTemplateInnerBlocks />
						) : null}

						<MemoizedPostTemplateBlockPreview
							blocks={blocks}
							blockContextId={blockContext.postId}
							setActiveBlockContextId={setActiveBlockContextId}
							isHidden={
								blockContext.postId ===
								(activeBlockContextId ||
									blockContexts[0]?.postId)
							}
						/>
					</BlockContextProvider>
				))}
			</div>

			{blockData && context.has_pagination === 'yes' && (
				<RawHTML>{blockData.pagination_output}</RawHTML>
			)}
		</>
	)
}

export default Edit
