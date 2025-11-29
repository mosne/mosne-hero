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
		} );
	};

	const onSelectMobileImage = ( image ) => {
		setAttributes( {
			mobileImageId: image.id,
			mobileImageUrl: image.url || image.source_url,
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

	const backgroundStyle = {
		backgroundPosition: contentPosition,
	};

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
											<img
												src={ desktopImageUrl }
												alt={ __( 'Desktop background', 'mosne-hero' ) }
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ onRemoveDesktopImage }
												variant="secondary"
												isDestructive
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
											<img
												src={ mobileImageUrl }
												alt={ __( 'Mobile background', 'mosne-hero' ) }
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ onRemoveMobileImage }
												variant="secondary"
												isDestructive
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
				<div className="mosne-hero-background" style={ backgroundStyle }>
					{ desktopImageUrl && (
						<div
							className="mosne-hero-background-image mosne-hero-background-desktop"
							style={ {
								backgroundImage: `url(${ desktopImageUrl })`,
							} }
						/>
					) }
					{ mobileImageUrl && (
						<div
							className="mosne-hero-background-image mosne-hero-background-mobile"
							style={ {
								backgroundImage: `url(${ mobileImageUrl })`,
							} }
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
