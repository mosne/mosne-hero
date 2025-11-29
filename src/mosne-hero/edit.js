/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	BlockControls,
	InnerBlocks,
} from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import {
	Button,
	PanelBody,
	RangeControl,
	ColorPicker,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	FocalPointPicker,
} from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block props.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		desktopImageId,
		desktopImageUrl,
		mobileImageId,
		mobileImageUrl,
		overlayColor,
		overlayOpacity,
		minHeight,
		contentPosition,
		desktopFocalPoint,
		mobileFocalPoint,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-create-block-mosne-hero',
		style: {
			minHeight: `${ minHeight }px`,
		},
	} );

	// Get image data from media library
	const desktopImage = useSelect(
		( select ) => {
			if ( ! desktopImageId ) {
				return null;
			}
			return select( 'core' ).getMedia( desktopImageId );
		},
		[ desktopImageId ]
	);

	const mobileImage = useSelect(
		( select ) => {
			if ( ! mobileImageId ) {
				return null;
			}
			return select( 'core' ).getMedia( mobileImageId );
		},
		[ mobileImageId ]
	);

	// Update image URL when image data is loaded
	useEffect( () => {
		if ( desktopImage && desktopImage.source_url ) {
			setAttributes( { desktopImageUrl: desktopImage.source_url } );
		}
	}, [ desktopImage ] );

	useEffect( () => {
		if ( mobileImage && mobileImage.source_url ) {
			setAttributes( { mobileImageUrl: mobileImage.source_url } );
		}
	}, [ mobileImage ] );

	// Meta will be saved automatically via PHP save_post hook when post is saved

	const onSelectDesktopImage = ( image ) => {
		setAttributes( {
			desktopImageId: image.id,
			desktopImageUrl: image.url || image.source_url,
			desktopFocalPoint: desktopFocalPoint || { x: 0.5, y: 0.5 },
		} );
	};

	const onSelectMobileImage = ( image ) => {
		setAttributes( {
			mobileImageId: image.id,
			mobileImageUrl: image.url || image.source_url,
			mobileFocalPoint: mobileFocalPoint || { x: 0.5, y: 0.5 },
		} );
	};

	const onRemoveDesktopImage = () => {
		setAttributes( {
			desktopImageId: 0,
			desktopImageUrl: '',
		} );
	};

	const onRemoveMobileImage = () => {
		setAttributes( {
			mobileImageId: 0,
			mobileImageUrl: '',
		} );
	};

	const overlayStyle = {
		backgroundColor: overlayColor,
		opacity: overlayOpacity,
	};

	// Calculate object-position from focal point
	const getObjectPosition = ( focalPoint ) => {
		if ( ! focalPoint || typeof focalPoint.x === 'undefined' || typeof focalPoint.y === 'undefined' ) {
			return '50% 50%';
		}
		return `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`;
	};

	// Ensure focal points have defaults
	const desktopFocalPointValue = desktopFocalPoint || { x: 0.5, y: 0.5 };
	const mobileFocalPointValue = mobileFocalPoint || { x: 0.5, y: 0.5 };

	const desktopImageStyle = desktopImageUrl
		? {
				objectPosition: getObjectPosition( desktopFocalPointValue ),
		  }
		: {};

	const mobileImageStyle = mobileImageUrl
		? {
				objectPosition: getObjectPosition( mobileFocalPointValue ),
		  }
		: {};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectDesktopImage }
							allowedTypes={ [ 'image' ] }
							value={ desktopImageId }
							render={ ( { open } ) => (
								<ToolbarButton
									onClick={ open }
									icon="format-image"
									label={ __( 'Change desktop image', 'mosne-hero' ) }
								/>
							) }
						/>
					</MediaUploadCheck>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Desktop Image', 'mosne-hero' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectDesktopImage }
							allowedTypes={ [ 'image' ] }
							value={ desktopImageId }
							render={ ( { open } ) => (
								<div>
									{ desktopImageUrl && ! isBlobURL( desktopImageUrl ) && (
										<>
											<FocalPointPicker
												label={ __( 'Focal Point Picker', 'mosne-hero' ) }
												url={ desktopImageUrl }
												value={ desktopFocalPointValue }
												onChange={ ( value ) =>
													setAttributes( { desktopFocalPoint: value } )
												}
											/>
											<Button
												onClick={ onRemoveDesktopImage }
												variant="secondary"
												isDestructive
												style={ { marginTop: '10px', width: '100%' } }
											>
												{ __( 'Remove desktop image', 'mosne-hero' ) }
											</Button>
										</>
									) }
									{ ( ! desktopImageUrl || isBlobURL( desktopImageUrl ) ) && (
										<Button onClick={ open } variant="primary">
											{ desktopImageId
												? __( 'Replace desktop image', 'mosne-hero' )
												: __( 'Select desktop image', 'mosne-hero' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={ __( 'Mobile Image', 'mosne-hero' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMobileImage }
							allowedTypes={ [ 'image' ] }
							value={ mobileImageId }
							render={ ( { open } ) => (
								<div>
									{ mobileImageUrl && ! isBlobURL( mobileImageUrl ) && (
										<>
											<FocalPointPicker
												label={ __( 'Focal Point Picker', 'mosne-hero' ) }
												url={ mobileImageUrl }
												value={ mobileFocalPointValue }
												onChange={ ( value ) =>
													setAttributes( { mobileFocalPoint: value } )
												}
											/>
											<Button
												onClick={ onRemoveMobileImage }
												variant="secondary"
												isDestructive
												style={ { marginTop: '10px', width: '100%' } }
											>
												{ __( 'Remove mobile image', 'mosne-hero' ) }
											</Button>
										</>
									) }
									{ ( ! mobileImageUrl || isBlobURL( mobileImageUrl ) ) && (
										<Button onClick={ open } variant="primary">
											{ mobileImageId
												? __( 'Replace mobile image', 'mosne-hero' )
												: __( 'Select mobile image', 'mosne-hero' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={ __( 'Overlay Settings', 'mosne-hero' ) }>
					<ColorPicker
						color={ overlayColor }
						onChangeComplete={ ( color ) => {
							setAttributes( { overlayColor: color.hex } );
						} }
						enableAlpha
					/>
					<RangeControl
						label={ __( 'Overlay Opacity', 'mosne-hero' ) }
						value={ overlayOpacity }
						onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout Settings', 'mosne-hero' ) }>
					<RangeControl
						label={ __( 'Minimum Height', 'mosne-hero' ) }
						value={ minHeight }
						onChange={ ( value ) => setAttributes( { minHeight: value } ) }
						min={ 100 }
						max={ 1000 }
						step={ 50 }
					/>
					<SelectControl
						label={ __( 'Content Position', 'mosne-hero' ) }
						value={ contentPosition }
						options={ [
							{ label: __( 'Top Left', 'mosne-hero' ), value: 'top left' },
							{ label: __( 'Top Center', 'mosne-hero' ), value: 'top center' },
							{ label: __( 'Top Right', 'mosne-hero' ), value: 'top right' },
							{ label: __( 'Center Left', 'mosne-hero' ), value: 'center left' },
							{ label: __( 'Center Center', 'mosne-hero' ), value: 'center center' },
							{ label: __( 'Center Right', 'mosne-hero' ), value: 'center right' },
							{ label: __( 'Bottom Left', 'mosne-hero' ), value: 'bottom left' },
							{ label: __( 'Bottom Center', 'mosne-hero' ), value: 'bottom center' },
							{ label: __( 'Bottom Right', 'mosne-hero' ), value: 'bottom right' },
						] }
						onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="mosne-hero-background">
					{ desktopImageUrl && (
						<img
							className="mosne-hero-background-image mosne-hero-background-desktop"
							src={ desktopImageUrl }
							alt=""
							style={ desktopImageStyle }
						/>
					) }
					{ mobileImageUrl && (
						<img
							className="mosne-hero-background-image mosne-hero-background-mobile"
							src={ mobileImageUrl }
							alt=""
							style={ mobileImageStyle }
						/>
					) }
					<div className="mosne-hero-overlay" style={ overlayStyle } />
				</div>
				<div className="mosne-hero-content">
					<InnerBlocks
						template={ [
							[ 'core/paragraph', { placeholder: __( 'Add your content here...', 'mosne-hero' ) } ],
						] }
					/>
				</div>
			</div>
		</>
	);
}
