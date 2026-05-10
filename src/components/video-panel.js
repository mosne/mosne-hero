/**
 * Video Panel component.
 *
 * @package
 */

import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

import { useImageSizes } from '../hooks/use-image-sizes';
import { getImageUrlForSize } from '../utils/image-helpers';

/**
 * Video Panel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Panel component.
 */
export function VideoPanel( { attributes, setAttributes } ) {
	const {
		mobileVideoUrl = '',
		mobilePosterId = 0,
		desktopPosterId = 0,
		mobilePosterUrl = '',
		desktopPosterUrl = '',
		videoHighFetchPriority = true,
		desktopPosterSize = 'large',
		mobilePosterSize = 'mosne-hero-mobile',
	} = attributes;

	// Get image sizes for dropdowns
	const imageSizeOptions = useImageSizes();

	// Get poster image data for size updates
	const desktopPosterImage = useSelect(
		( select ) => {
			if ( ! desktopPosterId ) {
				return null;
			}
			return select( 'core' ).getMedia( desktopPosterId );
		},
		[ desktopPosterId ]
	);

	const mobilePosterImage = useSelect(
		( select ) => {
			if ( ! mobilePosterId ) {
				return null;
			}
			return select( 'core' ).getMedia( mobilePosterId );
		},
		[ mobilePosterId ]
	);

	const onSelectMobileVideo = ( media ) => {
		if ( media && media.url ) {
			setAttributes( {
				mobileVideoUrl: media.url,
				variation: attributes.variation || 'mosne-hero-video',
			} );
		}
	};

	const onSelectMobilePoster = ( image ) => {
		if ( image && image.url ) {
			const url = getImageUrlForSize(
				image,
				mobilePosterSize || 'mosne-hero-mobile'
			);
			setAttributes( {
				mobilePosterId: image.id,
				mobilePosterUrl: url || image.url,
			} );
		}
	};

	const onRemoveMobileVideo = () => {
		setAttributes( {
			mobileVideoUrl: '',
		} );
	};

	const onRemoveMobilePoster = () => {
		setAttributes( {
			mobilePosterId: 0,
			mobilePosterUrl: '',
		} );
	};

	const onSelectDesktopPoster = ( image ) => {
		if ( image && image.url ) {
			const url = getImageUrlForSize(
				image,
				desktopPosterSize || 'large'
			);
			setAttributes( {
				desktopPosterId: image.id,
				desktopPosterUrl: url || image.url,
			} );
		}
	};

	const onRemoveDesktopPoster = () => {
		setAttributes( {
			desktopPosterId: 0,
			desktopPosterUrl: '',
		} );
	};

	return (
		<InspectorControls key="mosne-hero-video">
			<PanelBody
				title={ __( 'Video Settings', 'mosne-hero' ) }
				initialOpen={ true }
			>
				{ /* Video Loading Priority */ }
				<ToggleControl
					label={ __( 'High Fetch Priority', 'mosne-hero' ) }
					checked={ videoHighFetchPriority }
					onChange={ ( value ) => {
						setAttributes( { videoHighFetchPriority: value } );
					} }
					help={ __(
						'Prioritize loading of the video. Use for above-the-fold hero videos. Disable to use lazy loading.',
						'mosne-hero'
					) }
				/>

				{ /* Desktop Poster Size */ }
				<SelectControl
					label={ __( 'Desktop Poster Size', 'mosne-hero' ) }
					value={ desktopPosterSize || 'large' }
					options={ imageSizeOptions }
					onChange={ ( value ) => {
						setAttributes( { desktopPosterSize: value } );
						// Update URL if desktop poster exists
						if ( desktopPosterImage ) {
							const url = getImageUrlForSize(
								desktopPosterImage,
								value
							);
							if ( url ) {
								setAttributes( { desktopPosterUrl: url } );
							}
						}
					} }
					help={ __(
						'Choose the image size for the desktop poster.',
						'mosne-hero'
					) }
				/>

				{ /* Desktop Poster */ }
				<div style={ { marginBottom: '20px' } }>
					<h4>{ __( 'Desktop Poster', 'mosne-hero' ) }</h4>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectDesktopPoster }
							allowedTypes={ [ 'image' ] }
							value={ desktopPosterId }
							render={ ( { open } ) => (
								<div>
									{ desktopPosterUrl ? (
										<>
											<div
												style={ {
													marginBottom: '10px',
													border: '1px solid #e0e0e0',
													borderRadius: '4px',
													overflow: 'hidden',
												} }
											>
												<img
													src={ desktopPosterUrl }
													alt={ __(
														'Desktop poster preview',
														'mosne-hero'
													) }
													style={ {
														width: '100%',
														height: 'auto',
														display: 'block',
													} }
												/>
											</div>
											<Button
												onClick={ open }
												variant="secondary"
												style={ {
													marginBottom: '10px',
													width: '100%',
												} }
											>
												{ __(
													'Replace desktop poster',
													'mosne-hero'
												) }
											</Button>
											<Button
												onClick={
													onRemoveDesktopPoster
												}
												variant="secondary"
												isDestructive
												style={ {
													width: '100%',
												} }
											>
												{ __(
													'Remove desktop poster',
													'mosne-hero'
												) }
											</Button>
										</>
									) : (
										<Button
											onClick={ open }
											variant="primary"
											style={ {
												width: '100%',
											} }
										>
											{ __(
												'Select desktop poster',
												'mosne-hero'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>

				<hr
					style={ {
						margin: '20px 0',
						border: 'none',
						borderTop: '1px solid #e0e0e0',
					} }
				/>

				{ /* Mobile Video */ }
				<div style={ { marginBottom: '20px' } }>
					<h4>{ __( 'Mobile Video', 'mosne-hero' ) }</h4>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMobileVideo }
							allowedTypes={ [ 'video' ] }
							value={ mobileVideoUrl }
							render={ ( { open } ) => (
								<div>
									{ mobileVideoUrl ? (
										<>
											<TextControl
												label={ __(
													'Mobile Video URL',
													'mosne-hero'
												) }
												value={ mobileVideoUrl }
												onChange={ ( value ) =>
													setAttributes( {
														mobileVideoUrl: value,
													} )
												}
												help={ __(
													'Video URL for mobile view. If empty, desktop video will be used. Supports MP4, WebM, OGG formats.',
													'mosne-hero'
												) }
											/>
											<Button
												onClick={ onRemoveMobileVideo }
												variant="secondary"
												isDestructive
												style={ {
													marginTop: '10px',
													width: '100%',
												} }
											>
												{ __(
													'Remove mobile video',
													'mosne-hero'
												) }
											</Button>
										</>
									) : (
										<Button
											onClick={ open }
											variant="primary"
											style={ {
												width: '100%',
											} }
										>
											{ __(
												'Select mobile video',
												'mosne-hero'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>

				{ /* Mobile Poster Size */ }
				<SelectControl
					label={ __( 'Mobile Poster Size', 'mosne-hero' ) }
					value={ mobilePosterSize || 'mosne-hero-mobile' }
					options={ imageSizeOptions }
					onChange={ ( value ) => {
						setAttributes( { mobilePosterSize: value } );
						// Update URL if mobile poster exists
						if ( mobilePosterImage ) {
							const url = getImageUrlForSize(
								mobilePosterImage,
								value
							);
							if ( url ) {
								setAttributes( { mobilePosterUrl: url } );
							}
						}
					} }
					help={ __(
						'Choose the image size for the mobile poster. Default: mosne-hero-mobile.',
						'mosne-hero'
					) }
				/>

				{ /* Mobile Poster */ }
				<div style={ { marginBottom: '20px' } }>
					<h4>{ __( 'Mobile Poster', 'mosne-hero' ) }</h4>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMobilePoster }
							allowedTypes={ [ 'image' ] }
							value={ mobilePosterId }
							render={ ( { open } ) => (
								<div>
									{ mobilePosterUrl ? (
										<>
											<div
												style={ {
													marginBottom: '10px',
													border: '1px solid #e0e0e0',
													borderRadius: '4px',
													overflow: 'hidden',
												} }
											>
												<img
													src={ mobilePosterUrl }
													alt={ __(
														'Mobile poster preview',
														'mosne-hero'
													) }
													style={ {
														width: '100%',
														height: 'auto',
														display: 'block',
													} }
												/>
											</div>
											<Button
												onClick={ open }
												variant="secondary"
												style={ {
													marginBottom: '10px',
													width: '100%',
												} }
											>
												{ __(
													'Replace mobile poster',
													'mosne-hero'
												) }
											</Button>
											<Button
												onClick={ onRemoveMobilePoster }
												variant="secondary"
												isDestructive
												style={ {
													width: '100%',
												} }
											>
												{ __(
													'Remove mobile poster',
													'mosne-hero'
												) }
											</Button>
										</>
									) : (
										<Button
											onClick={ open }
											variant="primary"
											style={ {
												width: '100%',
											} }
										>
											{ __(
												'Select mobile poster',
												'mosne-hero'
											) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
