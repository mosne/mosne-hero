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
	FocalPointPicker,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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
		desktopVideoUrl = '',
		mobileFocalPoint,
		desktopFocalPoint,
		mobilePosterId = 0,
		desktopPosterId = 0,
		mobilePosterUrl = '',
		desktopPosterUrl = '',
	} = attributes;

	const onSelectDesktopVideo = ( media ) => {
		if ( media && media.url ) {
			setAttributes( {
				desktopVideoUrl: media.url,
				variation: attributes.variation || 'mosne-hero-video',
			} );
		}
	};

	const onSelectMobileVideo = ( media ) => {
		if ( media && media.url ) {
			setAttributes( {
				mobileVideoUrl: media.url,
				variation: attributes.variation || 'mosne-hero-video',
			} );
		}
	};

	const onSelectDesktopPoster = ( image ) => {
		if ( image && image.url ) {
			setAttributes( {
				desktopPosterId: image.id,
				desktopPosterUrl: image.url,
			} );
		}
	};

	const onSelectMobilePoster = ( image ) => {
		if ( image && image.url ) {
			setAttributes( {
				mobilePosterId: image.id,
				mobilePosterUrl: image.url,
			} );
		}
	};

	const onRemoveDesktopVideo = () => {
		setAttributes( {
			desktopVideoUrl: '',
		} );
	};

	const onRemoveMobileVideo = () => {
		setAttributes( {
			mobileVideoUrl: '',
		} );
	};

	const onRemoveDesktopPoster = () => {
		setAttributes( {
			desktopPosterId: 0,
			desktopPosterUrl: '',
		} );
	};

	const onRemoveMobilePoster = () => {
		setAttributes( {
			mobilePosterId: 0,
			mobilePosterUrl: '',
		} );
	};

	const desktopFocalPointValue = desktopFocalPoint || { x: 0.5, y: 0.5 };
	const mobileFocalPointValue = mobileFocalPoint || { x: 0.5, y: 0.5 };

	return (
		<InspectorControls key="mosne-hero-video">
			<PanelBody
				title={ __( 'Mobile Video Settings', 'mosne-hero' ) }
				initialOpen={ true }
			>
				{/* Mobile Video */}
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
												label={ __( 'Mobile Video URL', 'mosne-hero' ) }
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

				{/* Mobile Focal Point */}
				{ FocalPointPicker && mobileVideoUrl && (
					<FocalPointPicker
						label={ __(
							'Mobile Video Focal Point',
							'mosne-hero'
						) }
						url={ mobilePosterUrl || '' }
						value={ mobileFocalPointValue }
						onChange={ ( value ) => {
							if (
								value &&
								typeof value === 'object' &&
								typeof value.x === 'number' &&
								typeof value.y === 'number'
							) {
								setAttributes( {
									mobileFocalPoint: value,
								} );
							}
						} }
					/>
				) }

				{/* Mobile Poster */}
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
											<TextControl
												label={ __( 'Mobile Poster URL', 'mosne-hero' ) }
												value={ mobilePosterUrl }
												onChange={ ( value ) =>
													setAttributes( {
														mobilePosterUrl: value,
													} )
												}
												help={ __(
													'Poster image shown while video loads on mobile. If empty, desktop poster will be used.',
													'mosne-hero'
												) }
											/>
											<Button
												onClick={ onRemoveMobilePoster }
												variant="secondary"
												isDestructive
												style={ {
													marginTop: '10px',
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
