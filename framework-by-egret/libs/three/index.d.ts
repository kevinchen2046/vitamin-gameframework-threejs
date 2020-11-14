declare namespace THREE {
	// Animation ////////////////////////////////////////////////////////////////////////////////////////

	export class AnimationAction {

		constructor(mixer: AnimationMixer, clip: AnimationClip, localRoot?: Object3D, blendMode?: AnimationBlendMode);

		blendMode: AnimationBlendMode;
		loop: AnimationActionLoopStyles;
		time: number;
		timeScale: number;
		weight: number;
		repetitions: number;
		paused: boolean;
		enabled: boolean;
		clampWhenFinished: boolean;
		zeroSlopeAtStart: boolean;
		zeroSlopeAtEnd: boolean;

		play(): AnimationAction;
		stop(): AnimationAction;
		reset(): AnimationAction;
		isRunning(): boolean;
		isScheduled(): boolean;
		startAt(time: number): AnimationAction;
		setLoop(
			mode: AnimationActionLoopStyles,
			repetitions: number
		): AnimationAction;
		setEffectiveWeight(weight: number): AnimationAction;
		getEffectiveWeight(): number;
		fadeIn(duration: number): AnimationAction;
		fadeOut(duration: number): AnimationAction;
		crossFadeFrom(
			fadeOutAction: AnimationAction,
			duration: number,
			warp: boolean
		): AnimationAction;
		crossFadeTo(
			fadeInAction: AnimationAction,
			duration: number,
			warp: boolean
		): AnimationAction;
		stopFading(): AnimationAction;
		setEffectiveTimeScale(timeScale: number): AnimationAction;
		getEffectiveTimeScale(): number;
		setDuration(duration: number): AnimationAction;
		syncWith(action: AnimationAction): AnimationAction;
		halt(duration: number): AnimationAction;
		warp(
			statTimeScale: number,
			endTimeScale: number,
			duration: number
		): AnimationAction;
		stopWarping(): AnimationAction;
		getMixer(): AnimationMixer;
		getClip(): AnimationClip;
		getRoot(): Object3D;

	}


	export class AnimationClip {

		constructor(name?: string, duration?: number, tracks?: KeyframeTrack[], blendMode?: AnimationBlendMode);

		name: string;
		tracks: KeyframeTrack[];
		blendMode: AnimationBlendMode;
		duration: number;
		uuid: string;
		results: any[];

		resetDuration(): AnimationClip;
		trim(): AnimationClip;
		validate(): boolean;
		optimize(): AnimationClip;
		clone(): AnimationClip;

		static CreateFromMorphTargetSequence(
			name: string,
			morphTargetSequence: MorphTarget[],
			fps: number,
			noLoop: boolean
		): AnimationClip;
		static findByName(clipArray: AnimationClip[], name: string): AnimationClip;
		static CreateClipsFromMorphTargetSequences(
			morphTargets: MorphTarget[],
			fps: number,
			noLoop: boolean
		): AnimationClip[];
		static parse(json: any): AnimationClip;
		static parseAnimation(
			animation: any,
			bones: Bone[]
		): AnimationClip;
		static toJSON(): any;

	}


	export class AnimationMixer extends EventDispatcher {

		constructor(root: Object3D | AnimationObjectGroup);

		time: number;
		timeScale: number;

		clipAction(clip: AnimationClip, root?: Object3D | AnimationObjectGroup, blendMode?: AnimationBlendMode): AnimationAction;
		existingAction(clip: AnimationClip, root?: Object3D | AnimationObjectGroup): AnimationAction | null;
		stopAllAction(): AnimationMixer;
		update(deltaTime: number): AnimationMixer;
		setTime(timeInSeconds: number): AnimationMixer;
		getRoot(): Object3D | AnimationObjectGroup;
		uncacheClip(clip: AnimationClip): void;
		uncacheRoot(root: Object3D | AnimationObjectGroup): void;
		uncacheAction(clip: AnimationClip, root?: Object3D | AnimationObjectGroup): void;

	}

	export class AnimationObjectGroup {

		constructor(...args: any[]);

		uuid: string;
		stats: {
			bindingsPerObject: number;
			objects: {
				total: number;
				inUse: number;
			};
		};
		readonly isAnimationObjectGroup: true;

		add(...args: any[]): void;
		remove(...args: any[]): void;
		uncache(...args: any[]): void;

	}


	export namespace AnimationUtils {
		export function arraySlice(array: any, from: number, to: number): any;
		export function convertArray(array: any, type: any, forceClone: boolean): any;
		export function isTypedArray(object: any): boolean;
		export function getKeyFrameOrder(times: number[]): number[];
		export function sortedArray(
			values: any[],
			stride: number,
			order: number[]
		): any[];
		export function flattenJSON(
			jsonKeys: string[],
			times: any[],
			values: any[],
			valuePropertyName: string
		): void;
		export function subclip(
			sourceClip: AnimationClip,
			name: string,
			startFrame: number,
			endFrame: number,
			fps?: number
		): AnimationClip;
		export function makeClipAdditive(
			targetClip: AnimationClip,
			referenceFrame?: number,
			referenceClip?: AnimationClip,
			fps?: number
		): AnimationClip;
	}


	export class KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

		name: string;
		times: Float32Array;
		values: Float32Array;

		ValueTypeName: string;
		TimeBufferType: Float32Array;
		ValueBufferType: Float32Array;

		DefaultInterpolation: InterpolationModes;

		InterpolantFactoryMethodDiscrete(result: any): DiscreteInterpolant;
		InterpolantFactoryMethodLinear(result: any): LinearInterpolant;
		InterpolantFactoryMethodSmooth(result: any): CubicInterpolant;

		setInterpolation(interpolation: InterpolationModes): KeyframeTrack;
		getInterpolation(): InterpolationModes;

		getValueSize(): number;

		shift(timeOffset: number): KeyframeTrack;
		scale(timeScale: number): KeyframeTrack;
		trim(startTime: number, endTime: number): KeyframeTrack;
		validate(): boolean;
		optimize(): KeyframeTrack;
		clone(): KeyframeTrack;

		static toJSON(track: KeyframeTrack): any;

	}

	export interface ParseTrackNameResults {
		nodeName: string;
		objectName: string;
		objectIndex: string;
		propertyName: string;
		propertyIndex: string;
	}

	export class PropertyBinding {

		constructor(rootNode: any, path: string, parsedPath?: any);

		path: string;
		parsedPath: any;
		node: any;
		rootNode: any;

		getValue(targetArray: any, offset: number): any;
		setValue(sourceArray: any, offset: number): void;
		bind(): void;
		unbind(): void;

		BindingType: { [bindingType: string]: number };
		Versioning: { [versioning: string]: number };

		GetterByBindingType: Function[];
		SetterByBindingTypeAndVersioning: Array<Function[]>;

		static create(
			root: any,
			path: any,
			parsedPath?: any
		): PropertyBinding | PropertyBinding.Composite;
		static sanitizeNodeName(name: string): string;
		static parseTrackName(trackName: string): ParseTrackNameResults;
		static findNode(root: any, nodeName: string): any;

	}

	export namespace PropertyBinding {
		export class Composite {

			constructor(targetGroup: any, path: any, parsedPath?: any);

			getValue(array: any, offset: number): any;
			setValue(array: any, offset: number): void;
			bind(): void;
			unbind(): void;

		}
	}

	export class PropertyMixer {

		constructor(binding: any, typeName: string, valueSize: number);

		binding: any;
		valueSize: number;
		buffer: any;
		cumulativeWeight: number;
		cumulativeWeightAdditive: number;
		useCount: number;
		referenceCount: number;

		accumulate(accuIndex: number, weight: number): void;
		accumulateAdditive(weight: number): void;
		apply(accuIndex: number): void;
		saveOriginalState(): void;
		restoreOriginalState(): void;

	}


	export class BooleanKeyframeTrack extends KeyframeTrack {

		constructor(name: string, times: any[], values: any[]);

	}


	export class ColorKeyframeTrack extends KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

	}


	export class NumberKeyframeTrack extends KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

	}


	export class QuaternionKeyframeTrack extends KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

	}


	export class StringKeyframeTrack extends KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

	}


	export class VectorKeyframeTrack extends KeyframeTrack {

		constructor(
			name: string,
			times: any[],
			values: any[],
			interpolation?: InterpolationModes
		);

	}


	// Extras / Audio /////////////////////////////////////////////////////////////////////

	export class Audio<NodeType extends AudioNode | GainNode> extends Object3D {

		constructor(listener: AudioListener);
		type: 'Audio';

		listener: AudioListener;
		context: AudioContext;
		gain: GainNode;
		autoplay: boolean;
		buffer: null | AudioBuffer;
		detune: number;
		loop: boolean;
		loopStart: number;
		loopEnd: number;
		offset: number;
		duration: number | undefined;
		playbackRate: number;
		isPlaying: boolean;
		hasPlaybackControl: boolean;
		sourceType: string;
		source: AudioBufferSourceNode;
		filters: any[];

		getOutput(): NodeType;
		setNodeSource(audioNode: AudioBufferSourceNode): this;
		setMediaElementSource(mediaElement: HTMLMediaElement): this;
		setMediaStreamSource(mediaStream: MediaStream): this;
		setBuffer(audioBuffer: AudioBuffer): this;
		play(delay?: number): this;
		onEnded(): void;
		pause(): this;
		stop(): this;
		connect(): this;
		disconnect(): this;
		setDetune(value: number): this;
		getDetune(): number;
		getFilters(): any[];
		setFilters(value: any[]): this;
		getFilter(): any;
		setFilter(filter: any): this;
		setPlaybackRate(value: number): this;
		getPlaybackRate(): number;
		getLoop(): boolean;
		setLoop(value: boolean): this;
		setLoopStart(value: number): this;
		setLoopEnd(value: number): this;
		getVolume(): number;
		setVolume(value: number): this;
		/**
		 * @deprecated Use {@link AudioLoader} instead.
		 */
		load(file: string): Audio<AudioNode | GainNode>;

	}


	export class AudioAnalyser {

		constructor(audio: Audio<AudioNode>, fftSize: number);

		analyser: AnalyserNode;
		data: Uint8Array;

		getFrequencyData(): Uint8Array;
		getAverageFrequency(): number;

		/**
		 * @deprecated Use {@link AudioAnalyser#getFrequencyData .getFrequencyData()} instead.
		 */
		getData(file: any): any;

	}

	export const AudioContext: AudioContext;


	export class AudioListener extends Object3D {

		constructor();

		type: 'AudioListener';
		context: AudioContext;
		gain: GainNode;
		filter: null | any;
		timeDelta: number;

		getInput(): GainNode;
		removeFilter(): this;
		setFilter(value: any): this;
		getFilter(): any;
		setMasterVolume(value: number): this;
		getMasterVolume(): number;
		updateMatrixWorld(force?: boolean): void;

	}


	export class PositionalAudio extends Audio<PannerNode> {

		constructor(listener: AudioListener);

		panner: PannerNode;

		getOutput(): PannerNode;
		setRefDistance(value: number): this;
		getRefDistance(): number;
		setRolloffFactor(value: number): this;
		getRolloffFactor(): number;
		setDistanceModel(value: string): this;
		getDistanceModel(): string;
		setMaxDistance(value: number): this;
		getMaxDistance(): number;
		setDirectionalCone(
			coneInnerAngle: number,
			coneOuterAngle: number,
			coneOuterGain: number
		): this;
		updateMatrixWorld(force?: boolean): void;

	}


	export class ArrayCamera extends PerspectiveCamera {

		constructor(cameras?: PerspectiveCamera[]);

		cameras: PerspectiveCamera[];
		readonly isArrayCamera: true;

	}


	// Cameras ////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Abstract base class for cameras. This class should always be inherited when you build a new camera.
	 */
	export class Camera extends Object3D {

		/**
		 * This constructor sets following properties to the correct type: matrixWorldInverse, projectionMatrix and projectionMatrixInverse.
		 */
		constructor();

		/**
		 * This is the inverse of matrixWorld. MatrixWorld contains the Matrix which has the world transform of the Camera.
		 */
		matrixWorldInverse: Matrix4;

		/**
		 * This is the matrix which contains the projection.
		 */
		projectionMatrix: Matrix4;

		/**
		 * This is the inverse of projectionMatrix.
		 */
		projectionMatrixInverse: Matrix4;

		readonly isCamera: true;

		getWorldDirection(target: Vector3): Vector3;

		updateMatrixWorld(force?: boolean): void;

	}


	export class CubeCamera extends Object3D {

		constructor(near?: number, far?: number, cubeResolution?: number, options?: WebGLRenderTargetOptions);

		type: 'CubeCamera';

		renderTarget: WebGLCubeRenderTarget;

		update(renderer: WebGLRenderer, scene: Scene): void;

		clear(renderer: WebGLRenderer, color: boolean, depth: boolean, stencil: boolean): void;

	}


	/**
	 * Camera with orthographic projection
	 *
	 * @example
	 * var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
	 * scene.add( camera );
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/cameras/OrthographicCamera.js">src/cameras/OrthographicCamera.js</a>
	 */
	export class OrthographicCamera extends Camera {

		/**
		 * @param left Camera frustum left plane.
		 * @param right Camera frustum right plane.
		 * @param top Camera frustum top plane.
		 * @param bottom Camera frustum bottom plane.
		 * @param near Camera frustum near plane.
		 * @param far Camera frustum far plane.
		 */
		constructor(
			left: number,
			right: number,
			top: number,
			bottom: number,
			near?: number,
			far?: number
		);

		type: 'OrthographicCamera';

		readonly isOrthographicCamera: true;

		zoom: number;
		view: null | {
			enabled: boolean;
			fullWidth: number;
			fullHeight: number;
			offsetX: number;
			offsetY: number;
			width: number;
			height: number;
		};

		/**
		 * Camera frustum left plane.
		 */
		left: number;

		/**
		 * Camera frustum right plane.
		 */
		right: number;

		/**
		 * Camera frustum top plane.
		 */
		top: number;

		/**
		 * Camera frustum bottom plane.
		 */
		bottom: number;

		/**
		 * Camera frustum near plane.
		 */
		near: number;

		/**
		 * Camera frustum far plane.
		 */
		far: number;

		/**
		 * Updates the camera projection matrix. Must be called after change of parameters.
		 */
		updateProjectionMatrix(): void;
		setViewOffset(
			fullWidth: number,
			fullHeight: number,
			offsetX: number,
			offsetY: number,
			width: number,
			height: number
		): void;
		clearViewOffset(): void;
		toJSON(meta?: any): any;

	}


	/**
	 * Camera with perspective projection.
	 *
	 * @source https://github.com/mrdoob/three.js/blob/master/src/cameras/PerspectiveCamera.js
	 */
	export class PerspectiveCamera extends Camera {

		/**
		 * @param fov Camera frustum vertical field of view. Default value is 50.
		 * @param aspect Camera frustum aspect ratio. Default value is 1.
		 * @param near Camera frustum near plane. Default value is 0.1.
		 * @param far Camera frustum far plane. Default value is 2000.
		 */
		constructor(fov?: number, aspect?: number, near?: number, far?: number);

		type: 'PerspectiveCamera';

		readonly isPerspectiveCamera: true;

		zoom: number;

		/**
		 * Camera frustum vertical field of view, from bottom to top of view, in degrees.
		 */
		fov: number;

		/**
		 * Camera frustum aspect ratio, window width divided by window height.
		 */
		aspect: number;

		/**
		 * Camera frustum near plane.
		 */
		near: number;

		/**
		 * Camera frustum far plane.
		 */
		far: number;

		focus: number;
		view: null | {
			enabled: boolean;
			fullWidth: number;
			fullHeight: number;
			offsetX: number;
			offsetY: number;
			width: number;
			height: number;
		};
		filmGauge: number;
		filmOffset: number;

		setFocalLength(focalLength: number): void;
		getFocalLength(): number;
		getEffectiveFOV(): number;
		getFilmWidth(): number;
		getFilmHeight(): number;

		/**
		 * Sets an offset in a larger frustum. This is useful for multi-window or multi-monitor/multi-machine setups.
		 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and the monitors are in grid like this:
		 *
		 *		 +---+---+---+
		 *		 | A | B | C |
		 *		 +---+---+---+
		 *		 | D | E | F |
		 *		 +---+---+---+
		 *
		 * then for each monitor you would call it like this:
		 *
		 *		 var w = 1920;
		 *		 var h = 1080;
		 *		 var fullWidth = w * 3;
		 *		 var fullHeight = h * 2;
		 *
		 *		 // A
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
		 *		 // B
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
		 *		 // C
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
		 *		 // D
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
		 *		 // E
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
		 *		 // F
		 *		 camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h ); Note there is no reason monitors have to be the same size or in a grid.
		 *
		 * @param fullWidth full width of multiview setup
		 * @param fullHeight full height of multiview setup
		 * @param x horizontal offset of subcamera
		 * @param y vertical offset of subcamera
		 * @param width width of subcamera
		 * @param height height of subcamera
		 */
		setViewOffset(
			fullWidth: number,
			fullHeight: number,
			x: number,
			y: number,
			width: number,
			height: number
		): void;
		clearViewOffset(): void;

		/**
		 * Updates the camera projection matrix. Must be called after change of parameters.
		 */
		updateProjectionMatrix(): void;
		toJSON(meta?: any): any;

		/**
		 * @deprecated Use {@link PerspectiveCamera#setFocalLength .setFocalLength()} and {@link PerspectiveCamera#filmGauge .filmGauge} instead.
		 */
		setLens(focalLength: number, frameHeight?: number): void;

	}


	export class StereoCamera extends Camera {

		constructor();

		type: 'StereoCamera';

		aspect: number;
		eyeSep: number;
		cameraL: PerspectiveCamera;
		cameraR: PerspectiveCamera;

		update(camera: PerspectiveCamera): void;

	}

	export const REVISION: string;

	// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button
	export enum MOUSE {
		LEFT,
		MIDDLE,
		RIGHT,
		ROTATE,
		DOLLY,
		PAN,
	}

	export enum TOUCH {
		ROTATE,
		PAN,
		DOLLY_PAN,
		DOLLY_ROTATE,
	}

	// GL STATE CONSTANTS
	export enum CullFace { }
	export const CullFaceNone: CullFace;
	export const CullFaceBack: CullFace;
	export const CullFaceFront: CullFace;
	export const CullFaceFrontBack: CullFace;

	export enum FrontFaceDirection { }
	export const FrontFaceDirectionCW: FrontFaceDirection;
	export const FrontFaceDirectionCCW: FrontFaceDirection;

	// Shadowing Type
	export enum ShadowMapType { }
	export const BasicShadowMap: ShadowMapType;
	export const PCFShadowMap: ShadowMapType;
	export const PCFSoftShadowMap: ShadowMapType;
	export const VSMShadowMap: ShadowMapType;

	// MATERIAL CONSTANTS

	// side
	export enum Side { }
	export const FrontSide: Side;
	export const BackSide: Side;
	export const DoubleSide: Side;

	// shading
	export enum Shading { }
	export const FlatShading: Shading;
	export const SmoothShading: Shading;

	// blending modes
	export enum Blending { }
	export const NoBlending: Blending;
	export const NormalBlending: Blending;
	export const AdditiveBlending: Blending;
	export const SubtractiveBlending: Blending;
	export const MultiplyBlending: Blending;
	export const CustomBlending: Blending;

	// custom blending equations
	// (numbers start from 100 not to clash with other
	// mappings to OpenGL constants defined in Texture.js)
	export enum BlendingEquation { }
	export const AddEquation: BlendingEquation;
	export const SubtractEquation: BlendingEquation;
	export const ReverseSubtractEquation: BlendingEquation;
	export const MinEquation: BlendingEquation;
	export const MaxEquation: BlendingEquation;

	// custom blending destination factors
	export enum BlendingDstFactor { }
	export const ZeroFactor: BlendingDstFactor;
	export const OneFactor: BlendingDstFactor;
	export const SrcColorFactor: BlendingDstFactor;
	export const OneMinusSrcColorFactor: BlendingDstFactor;
	export const SrcAlphaFactor: BlendingDstFactor;
	export const OneMinusSrcAlphaFactor: BlendingDstFactor;
	export const DstAlphaFactor: BlendingDstFactor;
	export const OneMinusDstAlphaFactor: BlendingDstFactor;
	export const DstColorFactor: BlendingDstFactor;
	export const OneMinusDstColorFactor: BlendingDstFactor;

	// custom blending src factors
	export enum BlendingSrcFactor { }
	export const SrcAlphaSaturateFactor: BlendingSrcFactor;

	// depth modes
	export enum DepthModes { }
	export const NeverDepth: DepthModes;
	export const AlwaysDepth: DepthModes;
	export const LessDepth: DepthModes;
	export const LessEqualDepth: DepthModes;
	export const EqualDepth: DepthModes;
	export const GreaterEqualDepth: DepthModes;
	export const GreaterDepth: DepthModes;
	export const NotEqualDepth: DepthModes;

	// TEXTURE CONSTANTS
	// Operations
	export enum Combine { }
	export const MultiplyOperation: Combine;
	export const MixOperation: Combine;
	export const AddOperation: Combine;

	// Tone Mapping modes
	export enum ToneMapping { }
	export const NoToneMapping: ToneMapping;
	export const LinearToneMapping: ToneMapping;
	export const ReinhardToneMapping: ToneMapping;
	export const Uncharted2ToneMapping: ToneMapping;
	export const CineonToneMapping: ToneMapping;
	export const ACESFilmicToneMapping: ToneMapping;

	// Mapping modes
	export enum Mapping { }
	export const UVMapping: Mapping;
	export const CubeReflectionMapping: Mapping;
	export const CubeRefractionMapping: Mapping;
	export const EquirectangularReflectionMapping: Mapping;
	export const EquirectangularRefractionMapping: Mapping;
	export const SphericalReflectionMapping: Mapping;
	export const CubeUVReflectionMapping: Mapping;
	export const CubeUVRefractionMapping: Mapping;

	// Wrapping modes
	export enum Wrapping { }
	export const RepeatWrapping: Wrapping;
	export const ClampToEdgeWrapping: Wrapping;
	export const MirroredRepeatWrapping: Wrapping;

	// Filters
	export enum TextureFilter { }
	export const NearestFilter: TextureFilter;
	export const NearestMipmapNearestFilter: TextureFilter;
	export const NearestMipMapNearestFilter: TextureFilter;
	export const NearestMipmapLinearFilter: TextureFilter;
	export const NearestMipMapLinearFilter: TextureFilter;
	export const LinearFilter: TextureFilter;
	export const LinearMipmapNearestFilter: TextureFilter;
	export const LinearMipMapNearestFilter: TextureFilter;
	export const LinearMipmapLinearFilter: TextureFilter;
	export const LinearMipMapLinearFilter: TextureFilter;

	// Data types
	export enum TextureDataType { }
	export const UnsignedByteType: TextureDataType;
	export const ByteType: TextureDataType;
	export const ShortType: TextureDataType;
	export const UnsignedShortType: TextureDataType;
	export const IntType: TextureDataType;
	export const UnsignedIntType: TextureDataType;
	export const FloatType: TextureDataType;
	export const HalfFloatType: TextureDataType;
	export const UnsignedShort4444Type: TextureDataType;
	export const UnsignedShort5551Type: TextureDataType;
	export const UnsignedShort565Type: TextureDataType;
	export const UnsignedInt248Type: TextureDataType;

	// Pixel formats
	export enum PixelFormat { }
	export const AlphaFormat: PixelFormat;
	export const RGBFormat: PixelFormat;
	export const RGBAFormat: PixelFormat;
	export const LuminanceFormat: PixelFormat;
	export const LuminanceAlphaFormat: PixelFormat;
	export const RGBEFormat: PixelFormat;
	export const DepthFormat: PixelFormat;
	export const DepthStencilFormat: PixelFormat;
	export const RedFormat: PixelFormat;
	export const RedIntegerFormat: PixelFormat;
	export const RGFormat: PixelFormat;
	export const RGIntegerFormat: PixelFormat;
	export const RGBIntegerFormat: PixelFormat;
	export const RGBAIntegerFormat: PixelFormat;

	// Internal Pixel Formats
	export type PixelFormatGPU =
		'ALPHA'
		| 'RGB'
		| 'RGBA'
		| 'LUMINANCE'
		| 'LUMINANCE_ALPHA'
		| 'RED_INTEGER'
		| 'R8'
		| 'R8_SNORM'
		| 'R8I'
		| 'R8UI'
		| 'R16I'
		| 'R16UI'
		| 'R16F'
		| 'R32I'
		| 'R32UI'
		| 'R32F'
		| 'RG8'
		| 'RG8_SNORM'
		| 'RG8I'
		| 'RG8UI'
		| 'RG16I'
		| 'RG16UI'
		| 'RG16F'
		| 'RG32I'
		| 'RG32UI'
		| 'RG32F'
		| 'RGB565'
		| 'RGB8'
		| 'RGB8_SNORM'
		| 'RGB8I'
		| 'RGB8UI'
		| 'RGB16I'
		| 'RGB16UI'
		| 'RGB16F'
		| 'RGB32I'
		| 'RGB32UI'
		| 'RGB32F'
		| 'RGB9_E5'
		| 'SRGB8'
		| 'R11F_G11F_B10F'
		| 'RGBA4'
		| 'RGBA8'
		| 'RGBA8_SNORM'
		| 'RGBA8I'
		| 'RGBA8UI'
		| 'RGBA16I'
		| 'RGBA16UI'
		| 'RGBA16F'
		| 'RGBA32I'
		| 'RGBA32UI'
		| 'RGBA32F'
		| 'RGB5_A1'
		| 'RGB10_A2'
		| 'RGB10_A2UI'
		| 'SRGB8_ALPHA8'
		| 'DEPTH_COMPONENT16'
		| 'DEPTH_COMPONENT24'
		| 'DEPTH_COMPONENT32F'
		| 'DEPTH24_STENCIL8'
		| 'DEPTH32F_STENCIL8';

	// Compressed texture formats
	// DDS / ST3C Compressed texture formats
	export enum CompressedPixelFormat { }
	export const RGB_S3TC_DXT1_Format: CompressedPixelFormat;
	export const RGBA_S3TC_DXT1_Format: CompressedPixelFormat;
	export const RGBA_S3TC_DXT3_Format: CompressedPixelFormat;
	export const RGBA_S3TC_DXT5_Format: CompressedPixelFormat;

	// PVRTC compressed './texture formats
	export const RGB_PVRTC_4BPPV1_Format: CompressedPixelFormat;
	export const RGB_PVRTC_2BPPV1_Format: CompressedPixelFormat;
	export const RGBA_PVRTC_4BPPV1_Format: CompressedPixelFormat;
	export const RGBA_PVRTC_2BPPV1_Format: CompressedPixelFormat;

	// ETC compressed texture formats
	export const RGB_ETC1_Format: CompressedPixelFormat;
	export const RGB_ETC2_Format: CompressedPixelFormat;
	export const RGBA_ETC2_EAC_Format: CompressedPixelFormat;

	// ASTC compressed texture formats
	export const RGBA_ASTC_4x4_Format: CompressedPixelFormat;
	export const RGBA_ASTC_5x4_Format: CompressedPixelFormat;
	export const RGBA_ASTC_5x5_Format: CompressedPixelFormat;
	export const RGBA_ASTC_6x5_Format: CompressedPixelFormat;
	export const RGBA_ASTC_6x6_Format: CompressedPixelFormat;
	export const RGBA_ASTC_8x5_Format: CompressedPixelFormat;
	export const RGBA_ASTC_8x6_Format: CompressedPixelFormat;
	export const RGBA_ASTC_8x8_Format: CompressedPixelFormat;
	export const RGBA_ASTC_10x5_Format: CompressedPixelFormat;
	export const RGBA_ASTC_10x6_Format: CompressedPixelFormat;
	export const RGBA_ASTC_10x8_Format: CompressedPixelFormat;
	export const RGBA_ASTC_10x10_Format: CompressedPixelFormat;
	export const RGBA_ASTC_12x10_Format: CompressedPixelFormat;
	export const RGBA_ASTC_12x12_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_4x4_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_5x4_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_5x5_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_6x5_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_6x6_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_8x5_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_8x6_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_8x8_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_10x5_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_10x6_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_10x8_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_10x10_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_12x10_Format: CompressedPixelFormat;
	export const SRGB8_ALPHA8_ASTC_12x12_Format: CompressedPixelFormat;

	// BPTC compressed texture formats
	export const RGBA_BPTC_Format: CompressedPixelFormat;

	// Loop styles for AnimationAction
	export enum AnimationActionLoopStyles { }
	export const LoopOnce: AnimationActionLoopStyles;
	export const LoopRepeat: AnimationActionLoopStyles;
	export const LoopPingPong: AnimationActionLoopStyles;

	// Interpolation
	export enum InterpolationModes { }
	export const InterpolateDiscrete: InterpolationModes;
	export const InterpolateLinear: InterpolationModes;
	export const InterpolateSmooth: InterpolationModes;

	// Interpolant ending modes
	export enum InterpolationEndingModes { }
	export const ZeroCurvatureEnding: InterpolationEndingModes;
	export const ZeroSlopeEnding: InterpolationEndingModes;
	export const WrapAroundEnding: InterpolationEndingModes;

	// Animation blending modes
	export enum AnimationBlendMode { }
	export const NormalAnimationBlendMode: AnimationBlendMode;
	export const AdditiveAnimationBlendMode: AnimationBlendMode;

	// Triangle Draw modes
	export enum TrianglesDrawModes { }
	export const TrianglesDrawMode: TrianglesDrawModes;
	export const TriangleStripDrawMode: TrianglesDrawModes;
	export const TriangleFanDrawMode: TrianglesDrawModes;

	// Texture Encodings
	export enum TextureEncoding { }
	export const LinearEncoding: TextureEncoding;
	export const sRGBEncoding: TextureEncoding;
	export const GammaEncoding: TextureEncoding;
	export const RGBEEncoding: TextureEncoding;
	export const LogLuvEncoding: TextureEncoding;
	export const RGBM7Encoding: TextureEncoding;
	export const RGBM16Encoding: TextureEncoding;
	export const RGBDEncoding: TextureEncoding;

	// Depth packing strategies
	export enum DepthPackingStrategies { }
	export const BasicDepthPacking: DepthPackingStrategies;
	export const RGBADepthPacking: DepthPackingStrategies;

	// Normal Map types
	export enum NormalMapTypes { }
	export const TangentSpaceNormalMap: NormalMapTypes;
	export const ObjectSpaceNormalMap: NormalMapTypes;

	// Stencil Op types
	export enum StencilOp { }
	export const ZeroStencilOp: StencilOp;
	export const KeepStencilOp: StencilOp;
	export const ReplaceStencilOp: StencilOp;
	export const IncrementStencilOp: StencilOp;
	export const DecrementStencilOp: StencilOp;
	export const IncrementWrapStencilOp: StencilOp;
	export const DecrementWrapStencilOp: StencilOp;
	export const InvertStencilOp: StencilOp;

	// Stencil Func types
	export enum StencilFunc { }
	export const NeverStencilFunc: StencilFunc;
	export const LessStencilFunc: StencilFunc;
	export const EqualStencilFunc: StencilFunc;
	export const LessEqualStencilFunc: StencilFunc;
	export const GreaterStencilFunc: StencilFunc;
	export const NotEqualStencilFunc: StencilFunc;
	export const GreaterEqualStencilFunc: StencilFunc;
	export const AlwaysStencilFunc: StencilFunc;

	// usage types
	export enum Usage { }
	export const StaticDrawUsage: Usage;
	export const DynamicDrawUsage: Usage;
	export const StreamDrawUsage: Usage;
	export const StaticReadUsage: Usage;
	export const DynamicReadUsage: Usage;
	export const StreamReadUsage: Usage;
	export const StaticCopyUsage: Usage;
	export const DynamicCopyUsage: Usage;
	export const StreamCopyUsage: Usage;


	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferAttribute.js">src/core/BufferAttribute.js</a>
	 */
	export class BufferAttribute {

		constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean); // array parameter should be TypedArray.

		name: string;
		array: ArrayLike<number>;
		itemSize: number;
		usage: Usage;
		updateRange: { offset: number; count: number };
		version: number;
		normalized: boolean;
		count: number;

		needsUpdate: boolean;

		readonly isBufferAttribute: true;

		onUploadCallback: () => void;
		onUpload(callback: () => void): this;
		setUsage(usage: Usage): this;
		clone(): BufferAttribute;
		copy(source: BufferAttribute): this;
		copyAt(
			index1: number,
			attribute: BufferAttribute,
			index2: number
		): this;
		copyArray(array: ArrayLike<number>): this;
		copyColorsArray(
			colors: { r: number; g: number; b: number }[]
		): this;
		copyVector2sArray(vectors: { x: number; y: number }[]): this;
		copyVector3sArray(
			vectors: { x: number; y: number; z: number }[]
		): this;
		copyVector4sArray(
			vectors: { x: number; y: number; z: number; w: number }[]
		): this;
		applyMatrix3(m: Matrix3): this;
		applyMatrix4(m: Matrix4): this;
		applyNormalMatrix(m: Matrix3): this;
		transformDirection(m: Matrix4): this;
		set(
			value: ArrayLike<number> | ArrayBufferView,
			offset?: number
		): this;
		getX(index: number): number;
		setX(index: number, x: number): this;
		getY(index: number): number;
		setY(index: number, y: number): this;
		getZ(index: number): number;
		setZ(index: number, z: number): this;
		getW(index: number): number;
		setW(index: number, z: number): this;
		setXY(index: number, x: number, y: number): this;
		setXYZ(index: number, x: number, y: number, z: number): this;
		setXYZW(
			index: number,
			x: number,
			y: number,
			z: number,
			w: number
		): this;
		toJSON(): {
			itemSize: number,
			type: string,
			array: number[],
			normalized: boolean
		};

	}

	/**
	 * @deprecated THREE.Int8Attribute has been removed. Use new THREE.Int8BufferAttribute() instead.
	 */
	export class Int8Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Uint8Attribute has been removed. Use new THREE.Uint8BufferAttribute() instead.
	 */
	export class Uint8Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Uint8ClampedAttribute has been removed. Use new THREE.Uint8ClampedBufferAttribute() instead.
	 */
	export class Uint8ClampedAttribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Int16Attribute has been removed. Use new THREE.Int16BufferAttribute() instead.
	 */
	export class Int16Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Uint16Attribute has been removed. Use new THREE.Uint16BufferAttribute() instead.
	 */
	export class Uint16Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Int32Attribute has been removed. Use new THREE.Int32BufferAttribute() instead.
	 */
	export class Int32Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Uint32Attribute has been removed. Use new THREE.Uint32BufferAttribute() instead.
	 */
	export class Uint32Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Float32Attribute has been removed. Use new THREE.Float32BufferAttribute() instead.
	 */
	export class Float32Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	/**
	 * @deprecated THREE.Float64Attribute has been removed. Use new THREE.Float64BufferAttribute() instead.
	 */
	export class Float64Attribute extends BufferAttribute {

		constructor(array: any, itemSize: number);

	}

	export class Int8BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Uint8BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Uint8ClampedBufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Int16BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Uint16BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Int32BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Uint32BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Float32BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}

	export class Float64BufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number> | ArrayBuffer | number,
			itemSize: number,
			normalized?: boolean
		);

	}


	/**
	 * This is a superefficent class for geometries because it saves all data in buffers.
	 * It reduces memory costs and cpu cycles. But it is not as easy to work with because of all the necessary buffer calculations.
	 * It is mainly interesting when working with static objects.
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferGeometry.js">src/core/BufferGeometry.js</a>
	 */
	export class BufferGeometry extends EventDispatcher {

		/**
		 * This creates a new BufferGeometry. It also sets several properties to an default value.
		 */
		constructor();

		static MaxIndex: number;

		/**
		 * Unique number of this buffergeometry instance
		 */
		id: number;
		uuid: string;
		name: string;
		type: string;
		index: BufferAttribute | null;
		attributes: {
			[name: string]: BufferAttribute | InterleavedBufferAttribute;
		};
		morphAttributes: {
			[name: string]: (BufferAttribute | InterleavedBufferAttribute)[];
		};
		morphTargetsRelative: boolean;
		groups: { start: number; count: number; materialIndex?: number }[];
		boundingBox: Box3 | null;
		boundingSphere: Sphere | null;
		drawRange: { start: number; count: number };
		userData: { [key: string]: any };
		readonly isBufferGeometry: true;

		getIndex(): BufferAttribute | null;
		setIndex(index: BufferAttribute | number[] | null): void;

		setAttribute(name: string, attribute: BufferAttribute | InterleavedBufferAttribute): BufferGeometry;
		getAttribute(name: string): BufferAttribute | InterleavedBufferAttribute;
		deleteAttribute(name: string): BufferGeometry;

		addGroup(start: number, count: number, materialIndex?: number): void;
		clearGroups(): void;

		setDrawRange(start: number, count: number): void;

		/**
		 * Bakes matrix transform directly into vertex coordinates.
		 */
		applyMatrix4(matrix: Matrix4): BufferGeometry;

		rotateX(angle: number): BufferGeometry;
		rotateY(angle: number): BufferGeometry;
		rotateZ(angle: number): BufferGeometry;
		translate(x: number, y: number, z: number): BufferGeometry;
		scale(x: number, y: number, z: number): BufferGeometry;
		lookAt(v: Vector3): void;

		center(): BufferGeometry;

		setFromObject(object: Object3D): BufferGeometry;
		setFromPoints(points: Vector3[] | Vector2[]): BufferGeometry;
		updateFromObject(object: Object3D): void;

		fromGeometry(geometry: Geometry, settings?: any): BufferGeometry;

		fromDirectGeometry(geometry: DirectGeometry): BufferGeometry;

		/**
		 * Computes bounding box of the geometry, updating Geometry.boundingBox attribute.
		 * Bounding boxes aren't computed by default. They need to be explicitly computed, otherwise they are null.
		 */
		computeBoundingBox(): void;

		/**
		 * Computes bounding sphere of the geometry, updating Geometry.boundingSphere attribute.
		 * Bounding spheres aren't' computed by default. They need to be explicitly computed, otherwise they are null.
		 */
		computeBoundingSphere(): void;

		/**
		 * Computes vertex normals by averaging face normals.
		 */
		computeVertexNormals(): void;

		merge(geometry: BufferGeometry, offset?: number): BufferGeometry;
		normalizeNormals(): void;

		toNonIndexed(): BufferGeometry;

		toJSON(): any;
		clone(): this;
		copy(source: BufferGeometry): this;

		/**
		 * Disposes the object from memory.
		 * You need to call this when you want the bufferGeometry removed while the application is running.
		 */
		dispose(): void;

		/**
		 * @deprecated Use {@link BufferGeometry#groups .groups} instead.
		 */
		drawcalls: any;

		/**
		 * @deprecated Use {@link BufferGeometry#groups .groups} instead.
		 */
		offsets: any;

		/**
		 * @deprecated Use {@link BufferGeometry#setIndex .setIndex()} instead.
		 */
		addIndex(index: any): void;

		/**
		 * @deprecated Use {@link BufferGeometry#addGroup .addGroup()} instead.
		 */
		addDrawCall(start: any, count: any, indexOffset?: any): void;

		/**
		 * @deprecated Use {@link BufferGeometry#clearGroups .clearGroups()} instead.
		 */
		clearDrawCalls(): void;

		/**
		 * @deprecated Use {@link BufferGeometry#setAttribute .setAttribute()} instead.
		 */
		addAttribute(
			name: string,
			attribute: BufferAttribute | InterleavedBufferAttribute
		): BufferGeometry;

		/**
		 * @deprecated Use {@link BufferGeometry#deleteAttribute .deleteAttribute()} instead.
		 */
		removeAttribute(name: string): BufferGeometry;

		addAttribute(name: any, array: any, itemSize: any): any;

	}

	/**
	 * Object for keeping track of time.
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js">src/core/Clock.js</a>
	 */
	export class Clock {

		/**
		 * @param autoStart Automatically start the clock.
		 */
		constructor(autoStart?: boolean);

		/**
		 * If set, starts the clock automatically when the first update is called.
		 */
		autoStart: boolean;

		/**
		 * When the clock is running, It holds the starttime of the clock.
		 * This counted from the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
		 */
		startTime: number;

		/**
		 * When the clock is running, It holds the previous time from a update.
		 * This counted from the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
		 */
		oldTime: number;

		/**
		 * When the clock is running, It holds the time elapsed between the start of the clock to the previous update.
		 * This parameter is in seconds of three decimal places.
		 */
		elapsedTime: number;

		/**
		 * This property keeps track whether the clock is running or not.
		 */
		running: boolean;

		/**
		 * Starts clock.
		 */
		start(): void;

		/**
		 * Stops clock.
		 */
		stop(): void;

		/**
		 * Get the seconds passed since the clock started.
		 */
		getElapsedTime(): number;

		/**
		 * Get the seconds passed since the last call to this method.
		 */
		getDelta(): number;

	}

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/DirectGeometry.js">src/core/DirectGeometry.js</a>
	 */
	export class DirectGeometry {

		constructor();

		id: number;
		uuid: string;
		name: string;
		type: string;
		indices: number[];
		vertices: Vector3[];
		normals: Vector3[];
		colors: Color[];
		uvs: Vector2[];
		uvs2: Vector2[];
		groups: { start: number; materialIndex: number }[];
		morphTargets: MorphTarget[];
		skinWeights: Vector4[];
		skinIndices: Vector4[];
		boundingBox: Box3 | null;
		boundingSphere: Sphere | null;
		verticesNeedUpdate: boolean;
		normalsNeedUpdate: boolean;
		colorsNeedUpdate: boolean;
		uvsNeedUpdate: boolean;
		groupsNeedUpdate: boolean;

		computeBoundingBox(): void;
		computeBoundingSphere(): void;
		computeGroups(geometry: Geometry): void;
		fromGeometry(geometry: Geometry): DirectGeometry;
		dispose(): void;

	}

	/**
	 * Event object.
	 */
	export interface Event {
		type: string;
		target?: any;
		[attachment: string]: any;
	}

	/**
	 * JavaScript events for custom objects
	 *
	 * @source src/core/EventDispatcher.js
	 */
	export class EventDispatcher {

		/**
		 * Creates eventDispatcher object. It needs to be call with '.call' to add the functionality to an object.
		 */
		constructor();

		/**
		 * Adds a listener to an event type.
		 * @param type The type of event to listen to.
		 * @param listener The function that gets called when the event is fired.
		 */
		addEventListener(type: string, listener: (event: Event) => void): void;

		/**
		 * Checks if listener is added to an event type.
		 * @param type The type of event to listen to.
		 * @param listener The function that gets called when the event is fired.
		 */
		hasEventListener(type: string, listener: (event: Event) => void): boolean;

		/**
		 * Removes a listener from an event type.
		 * @param type The type of the listener that gets removed.
		 * @param listener The listener function that gets removed.
		 */
		removeEventListener(type: string, listener: (event: Event) => void): void;

		/**
		 * Fire an event type.
		 * @param type The type of event that gets fired.
		 */
		dispatchEvent(event: { type: string;[attachment: string]: any }): void;

	}


	/**
	 * Triangle face.
	 *
	 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
	 */
	export class Face3 {

		/**
		 * @param a Vertex A index.
		 * @param b Vertex B index.
		 * @param c Vertex C index.
		 * @param normal Face normal or array of vertex normals.
		 * @param color Face color or array of vertex colors.
		 * @param materialIndex Material index.
		 */
		constructor(
			a: number,
			b: number,
			c: number,
			normal?: Vector3,
			color?: Color,
			materialIndex?: number
		);
		constructor(
			a: number,
			b: number,
			c: number,
			normal?: Vector3,
			vertexColors?: Color[],
			materialIndex?: number
		);
		constructor(
			a: number,
			b: number,
			c: number,
			vertexNormals?: Vector3[],
			color?: Color,
			materialIndex?: number
		);
		constructor(
			a: number,
			b: number,
			c: number,
			vertexNormals?: Vector3[],
			vertexColors?: Color[],
			materialIndex?: number
		);

		/**
		 * Vertex A index.
		 */
		a: number;

		/**
		 * Vertex B index.
		 */
		b: number;

		/**
		 * Vertex C index.
		 */
		c: number;

		/**
		 * Face normal.
		 */
		normal: Vector3;

		/**
		 * Array of 4 vertex normals.
		 */
		vertexNormals: Vector3[];

		/**
		 * Face color.
		 */
		color: Color;

		/**
		 * Array of 4 vertex normals.
		 */
		vertexColors: Color[];

		/**
		 * Material index (points to {@link Geometry.materials}).
		 */
		materialIndex: number;

		clone(): this;
		copy(source: Face3): this;

	}


	/**
	 * @deprecated Use {@link Face3} instead.
	 */

	export interface MorphTarget {
		name: string;
		vertices: Vector3[];
	}

	export interface MorphColor {
		name: string;
		colors: Color[];
	}

	export interface MorphNormals {
		name: string;
		normals: Vector3[];
	}

	export let GeometryIdCount: number;

	/**
	 * Base class for geometries
	 *
	 * @see https://github.com/mrdoob/three.js/blob/master/src/core/Geometry.js
	 */
	export class Geometry extends EventDispatcher {

		constructor();

		/**
		 * Unique number of this geometry instance
		 */
		id: number;

		uuid: string;

		readonly isGeometry: true;

		/**
		 * Name for this geometry. Default is an empty string.
		 */
		name: string;

		type: string;

		/**
		 * The array of vertices hold every position of points of the model.
		 * To signal an update in this array, Geometry.verticesNeedUpdate needs to be set to true.
		 */
		vertices: Vector3[];

		/**
		 * Array of vertex colors, matching number and order of vertices.
		 * Used in ParticleSystem, Line and Ribbon.
		 * Meshes use per-face-use-of-vertex colors embedded directly in faces.
		 * To signal an update in this array, Geometry.colorsNeedUpdate needs to be set to true.
		 */
		colors: Color[];

		/**
		 * Array of triangles or/and quads.
		 * The array of faces describe how each vertex in the model is connected with each other.
		 * To signal an update in this array, Geometry.elementsNeedUpdate needs to be set to true.
		 */
		faces: Face3[];

		/**
		 * Array of face UV layers.
		 * Each UV layer is an array of UV matching order and number of vertices in faces.
		 * To signal an update in this array, Geometry.uvsNeedUpdate needs to be set to true.
		 */
		faceVertexUvs: Vector2[][][];

		/**
		 * Array of morph targets. Each morph target is a Javascript object:
		 *
		 *		 { name: "targetName", vertices: [ new THREE.Vector3(), ... ] }
		 *
		 * Morph vertices match number and order of primary vertices.
		 */
		morphTargets: MorphTarget[];

		/**
		 * Array of morph normals. Morph normals have similar structure as morph targets, each normal set is a Javascript object:
		 *
		 *		 morphNormal = { name: "NormalName", normals: [ new THREE.Vector3(), ... ] }
		 */
		morphNormals: MorphNormals[];

		/**
		 * Array of skinning weights, matching number and order of vertices.
		 */
		skinWeights: Vector4[];

		/**
		 * Array of skinning indices, matching number and order of vertices.
		 */
		skinIndices: Vector4[];

		/**
		 *
		 */
		lineDistances: number[];

		/**
		 * Bounding box.
		 */
		boundingBox: Box3 | null;

		/**
		 * Bounding sphere.
		 */
		boundingSphere: Sphere | null;

		/**
		 * Set to true if the vertices array has been updated.
		 */
		verticesNeedUpdate: boolean;

		/**
		 * Set to true if the faces array has been updated.
		 */
		elementsNeedUpdate: boolean;

		/**
		 * Set to true if the uvs array has been updated.
		 */
		uvsNeedUpdate: boolean;

		/**
		 * Set to true if the normals array has been updated.
		 */
		normalsNeedUpdate: boolean;

		/**
		 * Set to true if the colors array has been updated.
		 */
		colorsNeedUpdate: boolean;

		/**
		 * Set to true if the linedistances array has been updated.
		 */
		lineDistancesNeedUpdate: boolean;

		/**
		 *
		 */
		groupsNeedUpdate: boolean;

		/**
		 * Bakes matrix transform directly into vertex coordinates.
		 */
		applyMatrix4(matrix: Matrix4): Geometry;

		rotateX(angle: number): Geometry;
		rotateY(angle: number): Geometry;
		rotateZ(angle: number): Geometry;

		translate(x: number, y: number, z: number): Geometry;
		scale(x: number, y: number, z: number): Geometry;
		lookAt(vector: Vector3): void;

		fromBufferGeometry(geometry: BufferGeometry): Geometry;

		center(): Geometry;

		normalize(): Geometry;

		/**
		 * Computes face normals.
		 */
		computeFaceNormals(): void;

		/**
		 * Computes vertex normals by averaging face normals.
		 * Face normals must be existing / computed beforehand.
		 */
		computeVertexNormals(areaWeighted?: boolean): void;

		/**
		 * Compute vertex normals, but duplicating face normals.
		 */
		computeFlatVertexNormals(): void;

		/**
		 * Computes morph normals.
		 */
		computeMorphNormals(): void;

		/**
		 * Computes bounding box of the geometry, updating {@link Geometry.boundingBox} attribute.
		 */
		computeBoundingBox(): void;

		/**
		 * Computes bounding sphere of the geometry, updating Geometry.boundingSphere attribute.
		 * Neither bounding boxes or bounding spheres are computed by default. They need to be explicitly computed, otherwise they are null.
		 */
		computeBoundingSphere(): void;

		merge(
			geometry: Geometry,
			matrix?: Matrix,
			materialIndexOffset?: number
		): void;

		mergeMesh(mesh: Mesh): void;

		/**
		 * Checks for duplicate vertices using hashmap.
		 * Duplicated vertices are removed and faces' vertices are updated.
		 */
		mergeVertices(): number;

		setFromPoints(points: Array<Vector2> | Array<Vector3>): this;

		sortFacesByMaterialIndex(): void;

		toJSON(): any;

		/**
		 * Creates a new clone of the Geometry.
		 */
		clone(): this;

		copy(source: Geometry): this;

		/**
		 * Removes The object from memory.
		 * Don't forget to call this method when you remove an geometry because it can cuase meomory leaks.
		 */
		dispose(): void;

		// These properties do not exist in a normal Geometry class, but if you use the instance that was passed by JSONLoader, it will be added.
		bones: Bone[];
		animation: AnimationClip;
		animations: AnimationClip[];

	}


	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/examples/jsm/utils/BufferGeometryUtils.js">examples/jsm/utils/BufferGeometryUtils.js</a>
	 */
	export namespace BufferGeometryUtils {
		export function mergeBufferGeometries(
			geometries: BufferGeometry[]
		): BufferGeometry;
		export function computeTangents(geometry: BufferGeometry): null;
		export function mergeBufferAttributes(
			attributes: BufferAttribute[]
		): BufferAttribute;
	}

	/**
	 * @deprecated
	 */
	export namespace GeometryUtils {
		/**
		 * @deprecated Use {@link Geometry#merge geometry.merge( geometry2, matrix, materialIndexOffset )} instead.
		 */
		export function merge(
			geometry1: any,
			geometry2: any,
			materialIndexOffset?: any
		): any;
		/**
		 * @deprecated Use {@link Geometry#center geometry.center()} instead.
		 */
		export function center(geometry: any): any;
	}

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedBufferAttribute.js">src/core/InstancedBufferAttribute.js</a>
	 */
	export class InstancedBufferAttribute extends BufferAttribute {

		constructor(
			array: ArrayLike<number>,
			itemSize: number,
			normalized?: boolean,
			meshPerAttribute?: number
		);

		meshPerAttribute: number;

	}


	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedBufferGeometry.js">src/core/InstancedBufferGeometry.js</a>
	 */
	export class InstancedBufferGeometry extends BufferGeometry {

		constructor();

		groups: { start: number; count: number; instances: number }[];
		maxInstancedCount: number;

		addGroup(start: number, count: number, instances: number): void;

	}


	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedInterleavedBuffer.js">src/core/InstancedInterleavedBuffer.js</a>
	 */
	export class InstancedInterleavedBuffer extends InterleavedBuffer {

		constructor(
			array: ArrayLike<number>,
			stride: number,
			meshPerAttribute?: number
		);

		meshPerAttribute: number;

	}


	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InterleavedBuffer.js">src/core/InterleavedBuffer.js</a>
	 */
	export class InterleavedBuffer {

		constructor(array: ArrayLike<number>, stride: number);

		array: ArrayLike<number>;
		stride: number;
		usage: Usage;
		updateRange: { offset: number; count: number };
		version: number;
		length: number;
		count: number;
		needsUpdate: boolean;

		setUsage(usage: Usage): InterleavedBuffer;
		clone(): this;
		copy(source: InterleavedBuffer): this;
		copyAt(
			index1: number,
			attribute: InterleavedBufferAttribute,
			index2: number
		): InterleavedBuffer;
		set(value: ArrayLike<number>, index: number): InterleavedBuffer;

	}

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InterleavedBufferAttribute.js">src/core/InterleavedBufferAttribute.js</a>
	 */
	export class InterleavedBufferAttribute {

		constructor(
			interleavedBuffer: InterleavedBuffer,
			itemSize: number,
			offset: number,
			normalized?: boolean
		);

		data: InterleavedBuffer;
		itemSize: number;
		offset: number;
		normalized: boolean;

		readonly count: number;
		readonly array: ArrayLike<number>;

		readonly isInterleavedBufferAttribute: true;

		applyMatrix4(m: Matrix4): this;
		getX(index: number): number;
		setX(index: number, x: number): InterleavedBufferAttribute;
		getY(index: number): number;
		setY(index: number, y: number): InterleavedBufferAttribute;
		getZ(index: number): number;
		setZ(index: number, z: number): InterleavedBufferAttribute;
		getW(index: number): number;
		setW(index: number, z: number): InterleavedBufferAttribute;
		setXY(index: number, x: number, y: number): InterleavedBufferAttribute;
		setXYZ(
			index: number,
			x: number,
			y: number,
			z: number
		): InterleavedBufferAttribute;
		setXYZW(
			index: number,
			x: number,
			y: number,
			z: number,
			w: number
		): InterleavedBufferAttribute;

	}

	export class Layers {

		constructor();

		mask: number;

		set(channel: number): void;
		enable(channel: number): void;
		enableAll(): void;
		toggle(channel: number): void;
		disable(channel: number): void;
		disableAll(): void;
		test(layers: Layers): boolean;

	}


	export let Object3DIdCount: number;

	/**
	 * Base class for scene graph objects
	 */
	export class Object3D extends EventDispatcher {

		constructor();

		/**
		 * Unique number of this object instance.
		 */
		id: number;

		/**
		 *
		 */
		uuid: string;

		/**
		 * Optional name of the object (doesn't need to be unique).
		 */
		name: string;

		type: string;

		/**
		 * Object's parent in the scene graph.
		 */
		parent: Object3D | null;

		/**
		 * Array with object's children.
		 */
		children: Object3D[];

		/**
		 * Up direction.
		 */
		up: Vector3;

		/**
		 * Object's local position.
		 */
		readonly position: Vector3;

		/**
		 * Object's local rotation (Euler angles), in radians.
		 */
		readonly rotation: Euler;

		/**
		 * Global rotation.
		 */
		readonly quaternion: Quaternion;

		/**
		 * Object's local scale.
		 */
		readonly scale: Vector3;

		readonly modelViewMatrix: Matrix4;

		readonly normalMatrix: Matrix3;

		/**
		 * Local transform.
		 */
		matrix: Matrix4;

		/**
		 * The global transform of the object. If the Object3d has no parent, then it's identical to the local transform.
		 */
		matrixWorld: Matrix4;

		/**
		 * When this is set, it calculates the matrix of position, (rotation or quaternion) and scale every frame and also recalculates the matrixWorld property.
		 */
		matrixAutoUpdate: boolean;

		/**
		 * When this is set, it calculates the matrixWorld in that frame and resets this property to false.
		 */
		matrixWorldNeedsUpdate: boolean;

		layers: Layers;
		/**
		 * Object gets rendered if true.
		 */
		visible: boolean;

		/**
		 * Gets rendered into shadow map.
		 */
		castShadow: boolean;

		/**
		 * Material gets baked in shadow receiving.
		 */
		receiveShadow: boolean;

		/**
		 * When this is set, it checks every frame if the object is in the frustum of the camera. Otherwise the object gets drawn every frame even if it isn't visible.
		 */
		frustumCulled: boolean;

		/**
		 * Overrides the default rendering order of scene graph objects, from lowest to highest renderOrder. Opaque and transparent objects remain sorted independently though. When this property is set for an instance of Group, all descendants objects will be sorted and rendered together.
		 */
		renderOrder: number;

		/**
		 * An object that can be used to store custom data about the Object3d. It should not hold references to functions as these will not be cloned.
		 */
		userData: { [key: string]: any };

		/**
		 * Custom depth material to be used when rendering to the depth map. Can only be used in context of meshes.
		 * When shadow-casting with a DirectionalLight or SpotLight, if you are (a) modifying vertex positions in
		 * the vertex shader, (b) using a displacement map, (c) using an alpha map with alphaTest, or (d) using a
		 * transparent texture with alphaTest, you must specify a customDepthMaterial for proper shadows.
		 */
		customDepthMaterial: Material;

		/**
		 * Same as customDepthMaterial, but used with PointLight.
		 */
		customDistanceMaterial: Material;

		/**
		 * Used to check whether this or derived classes are Object3Ds. Default is true.
		 * You should not change this, as it is used internally for optimisation.
		 */
		readonly isObject3D: true;

		/**
		 * Calls before rendering object
		 */
		onBeforeRender: (
			renderer: WebGLRenderer,
			scene: Scene,
			camera: Camera,
			geometry: Geometry | BufferGeometry,
			material: Material,
			group: Group
		) => void;

		/**
		 * Calls after rendering object
		 */
		onAfterRender: (
			renderer: WebGLRenderer,
			scene: Scene,
			camera: Camera,
			geometry: Geometry | BufferGeometry,
			material: Material,
			group: Group
		) => void;

		static DefaultUp: Vector3;
		static DefaultMatrixAutoUpdate: boolean;

		/**
		 * This updates the position, rotation and scale with the matrix.
		 */
		applyMatrix4(matrix: Matrix4): void;

		applyQuaternion(quaternion: Quaternion): this;

		/**
		 *
		 */
		setRotationFromAxisAngle(axis: Vector3, angle: number): void;

		/**
		 *
		 */
		setRotationFromEuler(euler: Euler): void;

		/**
		 *
		 */
		setRotationFromMatrix(m: Matrix4): void;

		/**
		 *
		 */
		setRotationFromQuaternion(q: Quaternion): void;

		/**
		 * Rotate an object along an axis in object space. The axis is assumed to be normalized.
		 * @param axis	A normalized vector in object space.
		 * @param angle	The angle in radians.
		 */
		rotateOnAxis(axis: Vector3, angle: number): this;

		/**
		 * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
		 * @param axis	A normalized vector in object space.
		 * @param angle	The angle in radians.
		 */
		rotateOnWorldAxis(axis: Vector3, angle: number): this;

		/**
		 *
		 * @param angle
		 */
		rotateX(angle: number): this;

		/**
		 *
		 * @param angle
		 */
		rotateY(angle: number): this;

		/**
		 *
		 * @param angle
		 */
		rotateZ(angle: number): this;

		/**
		 * @param axis	A normalized vector in object space.
		 * @param distance	The distance to translate.
		 */
		translateOnAxis(axis: Vector3, distance: number): this;

		/**
		 * Translates object along x axis by distance.
		 * @param distance Distance.
		 */
		translateX(distance: number): this;

		/**
		 * Translates object along y axis by distance.
		 * @param distance Distance.
		 */
		translateY(distance: number): this;

		/**
		 * Translates object along z axis by distance.
		 * @param distance Distance.
		 */
		translateZ(distance: number): this;

		/**
		 * Updates the vector from local space to world space.
		 * @param vector A local vector.
		 */
		localToWorld(vector: Vector3): Vector3;

		/**
		 * Updates the vector from world space to local space.
		 * @param vector A world vector.
		 */
		worldToLocal(vector: Vector3): Vector3;

		/**
		 * Rotates object to face point in space.
		 * @param vector A world vector to look at.
		 */
		lookAt(vector: Vector3 | number, y?: number, z?: number): void;

		/**
		 * Adds object as child of this object.
		 */
		add(...object: Object3D[]): this;

		/**
		 * Removes object as child of this object.
		 */
		remove(...object: Object3D[]): this;

		/**
		 * Adds object as a child of this, while maintaining the object's world transform.
		 */
		attach(object: Object3D): this;

		/**
		 * Searches through the object's children and returns the first with a matching id.
		 * @param id	Unique number of the object instance
		 */
		getObjectById(id: number): Object3D | undefined;

		/**
		 * Searches through the object's children and returns the first with a matching name.
		 * @param name	String to match to the children's Object3d.name property.
		 */
		getObjectByName(name: string): Object3D | undefined;

		getObjectByProperty(name: string, value: string): Object3D | undefined;

		getWorldPosition(target: Vector3): Vector3;
		getWorldQuaternion(target: Quaternion): Quaternion;
		getWorldScale(target: Vector3): Vector3;
		getWorldDirection(target: Vector3): Vector3;

		raycast(raycaster: Raycaster, intersects: Intersection[]): void;

		traverse(callback: (object: Object3D) => any): void;

		traverseVisible(callback: (object: Object3D) => any): void;

		traverseAncestors(callback: (object: Object3D) => any): void;

		/**
		 * Updates local transform.
		 */
		updateMatrix(): void;

		/**
		 * Updates global transform of the object and its children.
		 */
		updateMatrixWorld(force?: boolean): void;

		updateWorldMatrix(updateParents: boolean, updateChildren: boolean): void;

		toJSON(meta?: {
			geometries: any;
			materials: any;
			textures: any;
			images: any;
		}): any;

		clone(recursive?: boolean): this;

		/**
		 *
		 * @param object
		 * @param recursive
		 */
		copy(source: this, recursive?: boolean): this;

	}


	export interface Intersection {
		distance: number;
		distanceToRay?: number;
		point: Vector3;
		index?: number;
		face?: Face3 | null;
		faceIndex?: number;
		object: Object3D;
		uv?: Vector2;
		instanceId?: number;
	}

	export interface RaycasterParameters {
		Mesh?: any;
		Line?: { threshold: number };
		LOD?: any;
		Points?: { threshold: number };
		Sprite?: any;
	}

	export class Raycaster {

		/**
		 * This creates a new raycaster object.
		 * @param origin The origin vector where the ray casts from.
		 * @param direction The direction vector that gives direction to the ray. Should be normalized.
		 * @param near All results returned are further away than near. Near can't be negative. Default value is 0.
		 * @param far All results returned are closer then far. Far can't be lower then near . Default value is Infinity.
		 */
		constructor(
			origin?: Vector3,
			direction?: Vector3,
			near?: number,
			far?: number
		);

		/** The Ray used for the raycasting. */
		ray: Ray;

		/**
		 * The near factor of the raycaster. This value indicates which objects can be discarded based on the
		 * distance. This value shouldn't be negative and should be smaller than the far property.
		 */
		near: number;

		/**
		 * The far factor of the raycaster. This value indicates which objects can be discarded based on the
		 * distance. This value shouldn't be negative and should be larger than the near property.
		 */
		far: number;

		/**
		 * The camera to use when raycasting against view-dependent objects such as billboarded objects like Sprites. This field
		 * can be set manually or is set when calling "setFromCamera".
		 */
		camera: Camera;

		/**
		 * Used by Raycaster to selectively ignore 3D objects when performing intersection tests.
		 */
		layers: Layers;

		params: RaycasterParameters;

		/**
		 * Updates the ray with a new origin and direction.
		 * @param origin The origin vector where the ray casts from.
		 * @param direction The normalized direction vector that gives direction to the ray.
		 */
		set(origin: Vector3, direction: Vector3): void;

		/**
		 * Updates the ray with a new origin and direction.
		 * @param coords 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
		 * @param camera camera from which the ray should originate
		 */
		setFromCamera(coords: { x: number; y: number }, camera: Camera): void;

		/**
		 * Checks all intersection between the ray and the object with or without the descendants. Intersections are returned sorted by distance, closest first.
		 * @param object The object to check for intersection with the ray.
		 * @param recursive If true, it also checks all descendants. Otherwise it only checks intersecton with the object. Default is false.
		 * @param optionalTarget (optional) target to set the result. Otherwise a new Array is instantiated. If set, you must clear this array prior to each call (i.e., array.length = 0;).
		 */
		intersectObject(
			object: Object3D,
			recursive?: boolean,
			optionalTarget?: Intersection[]
		): Intersection[];

		/**
		 * Checks all intersection between the ray and the objects with or without the descendants. Intersections are returned sorted by distance, closest first. Intersections are of the same form as those returned by .intersectObject.
		 * @param objects The objects to check for intersection with the ray.
		 * @param recursive If true, it also checks all descendants of the objects. Otherwise it only checks intersecton with the objects. Default is false.
		 * @param optionalTarget (optional) target to set the result. Otherwise a new Array is instantiated. If set, you must clear this array prior to each call (i.e., array.length = 0;).
		 */
		intersectObjects(
			objects: Object3D[],
			recursive?: boolean,
			optionalTarget?: Intersection[]
		): Intersection[];

	}

	export class Uniform {

		constructor(value: any);
		/**
		 * @deprecated
		 */
		constructor(type: string, value: any);
		/**
		 * @deprecated
		 */
		type: string;
		value: any;
		/**
		 * @deprecated Use {@link Object3D#onBeforeRender object.onBeforeRender()} instead.
		 */
		dynamic: boolean;
		onUpdateCallback: Function;

		/**
		 * @deprecated Use {@link Object3D#onBeforeRender object.onBeforeRender()} instead.
		 */
		onUpdate(callback: Function): Uniform;

	}


	// Extras / Core /////////////////////////////////////////////////////////////////////

	/**
	 * An extensible curve object which contains methods for interpolation
	 * class Curve&lt;T extends Vector&gt;
	 */
	export class Curve<T extends Vector> {

		/**
		 * This value determines the amount of divisions when calculating the cumulative segment lengths of a curve via .getLengths.
		 * To ensure precision when using methods like .getSpacedPoints, it is recommended to increase .arcLengthDivisions if the curve is very large.
		 * Default is 200.
		 */
		arcLengthDivisions: number;

		/**
		 * Returns a vector for point t of the curve where t is between 0 and 1
		 * getPoint(t: number, optionalTarget?: T): T;
		 */
		getPoint(t: number, optionalTarget?: T): T;

		/**
		 * Returns a vector for point at relative position in curve according to arc length
		 * getPointAt(u: number, optionalTarget?: T): T;
		 */
		getPointAt(u: number, optionalTarget?: T): T;

		/**
		 * Get sequence of points using getPoint( t )
		 * getPoints(divisions?: number): T[];
		 */
		getPoints(divisions?: number): T[];

		/**
		 * Get sequence of equi-spaced points using getPointAt( u )
		 * getSpacedPoints(divisions?: number): T[];
		 */
		getSpacedPoints(divisions?: number): T[];

		/**
		 * Get total curve arc length
		 */
		getLength(): number;

		/**
		 * Get list of cumulative segment lengths
		 */
		getLengths(divisions?: number): number[];

		/**
		 * Update the cumlative segment distance cache
		 */
		updateArcLengths(): void;

		/**
		 * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
		 */
		getUtoTmapping(u: number, distance: number): number;

		/**
		 * Returns a unit vector tangent at t. If the subclassed curve do not implement its tangent derivation, 2 points a small delta apart will be used to find its gradient which seems to give a reasonable approximation
		 * getTangent(t: number, optionalTarget?: T): T;
		 */
		getTangent(t: number, optionalTarget?: T): T;

		/**
		 * Returns tangent at equidistance point u on the curve
		 * getTangentAt(u: number, optionalTarget?: T): T;
		 */
		getTangentAt(u: number, optionalTarget?: T): T;

		clone(): Curve<T>;
		copy(source: Curve<T>): this;
		toJSON(): any;
		fromJSON(json: any): this;

		/**
		 * @deprecated since r84.
		 */
		static create(constructorFunc: Function, getPointFunc: Function): Function;

	}


	export class CurvePath<T extends Vector> extends Curve<T> {

		constructor();

		curves: Curve<T>[];
		autoClose: boolean;

		add(curve: Curve<T>): void;
		closePath(): void;
		getPoint(t: number): T;
		getCurveLengths(): number[];

		/**
		 * @deprecated Use {@link Geometry#setFromPoints new THREE.Geometry().setFromPoints( points )} instead.
		 */
		createPointsGeometry(divisions: number): Geometry;
		/**
		 * @deprecated Use {@link Geometry#setFromPoints new THREE.Geometry().setFromPoints( points )} instead.
		 */
		createSpacedPointsGeometry(divisions: number): Geometry;
		/**
		 * @deprecated Use {@link Geometry#setFromPoints new THREE.Geometry().setFromPoints( points )} instead.
		 */
		createGeometry(points: T[]): Geometry;

	}


	export class Font {

		constructor(jsondata: any);

		data: string;

		generateShapes(text: string, size: number): Shape[];

	}

	export namespace Interpolations {
		export function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number;
		export function QuadraticBezier(t: number, p0: number, p1: number, p2: number): number;
		export function CubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number;
	}


	/**
	 * a 2d path representation, comprising of points, lines, and cubes, similar to the html5 2d canvas api. It extends CurvePath.
	 */
	export class Path extends CurvePath<Vector2> {

		constructor(points?: Vector2[]);

		currentPoint: Vector2;

		/**
		 * @deprecated Use {@link Path#setFromPoints .setFromPoints()} instead.
		 */
		fromPoints(vectors: Vector2[]): this;
		setFromPoints(vectors: Vector2[]): this;
		moveTo(x: number, y: number): this;
		lineTo(x: number, y: number): this;
		quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this;
		bezierCurveTo(
			aCP1x: number,
			aCP1y: number,
			aCP2x: number,
			aCP2y: number,
			aX: number,
			aY: number
		): this;
		splineThru(pts: Vector2[]): this;
		arc(
			aX: number,
			aY: number,
			aRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean
		): this;
		absarc(
			aX: number,
			aY: number,
			aRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean
		): this;
		ellipse(
			aX: number,
			aY: number,
			xRadius: number,
			yRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean,
			aRotation: number
		): this;
		absellipse(
			aX: number,
			aY: number,
			xRadius: number,
			yRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean,
			aRotation: number
		): this;

	}


	/**
	 * Defines a 2d shape plane using paths.
	 */
	export class Shape extends Path {

		constructor(points?: Vector2[]);

		holes: Path[];

		/**
		 * @deprecated Use {@link ExtrudeGeometry ExtrudeGeometry()} instead.
		 */
		extrude(options?: any): ExtrudeGeometry;

		/**
		 * @deprecated Use {@link ShapeGeometry ShapeGeometry()} instead.
		 */
		makeGeometry(options?: any): ShapeGeometry;
		getPointsHoles(divisions: number): Vector2[][];

		/**
		 * @deprecated Use {@link Shape#extractPoints .extractPoints()} instead.
		 */
		extractAllPoints(
			divisions: number
		): {
				shape: Vector2[];
				holes: Vector2[][];
			};
		extractPoints(divisions: number): {
			shape: Vector2[];
			holes: Vector2[][];
		};

	}


	export class ShapePath {

		constructor();

		subPaths: any[];
		currentPath: any;

		moveTo(x: number, y: number): this;
		lineTo(x: number, y: number): this;
		quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this;
		bezierCurveTo(
			aCP1x: number,
			aCP1y: number,
			aCP2x: number,
			aCP2y: number,
			aX: number,
			aY: number
		): this;
		splineThru(pts: Vector2[]): this;
		toShapes(isCCW: boolean, noHoles?: boolean): Shape[];

	}

	export class ArcCurve extends EllipseCurve {

		constructor(
			aX: number,
			aY: number,
			aRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean
		);

	}


	// Extras / Curves /////////////////////////////////////////////////////////////////////
	export namespace CurveUtils {
		export function tangentQuadraticBezier(
			t: number,
			p0: number,
			p1: number,
			p2: number
		): number;
		export function tangentCubicBezier(
			t: number,
			p0: number,
			p1: number,
			p2: number,
			p3: number
		): number;
		export function tangentSpline(
			t: number,
			p0: number,
			p1: number,
			p2: number,
			p3: number
		): number;
		export function interpolate(
			p0: number,
			p1: number,
			p2: number,
			p3: number,
			t: number
		): number;
	}

	export class CatmullRomCurve3 extends Curve<Vector3> {

		constructor(
			points?: Vector3[],
			closed?: boolean,
			curveType?: string,
			tension?: number
		);

		points: Vector3[];

	}


	export class CubicBezierCurve extends Curve<Vector2> {

		constructor(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2);

		v0: Vector2;
		v1: Vector2;
		v2: Vector2;
		v3: Vector2;

	}


	export class CubicBezierCurve3 extends Curve<Vector3> {

		constructor(v0: Vector3, v1: Vector3, v2: Vector3, v3: Vector3);

		v0: Vector3;
		v1: Vector3;
		v2: Vector3;
		v3: Vector3;

	}

	export class EllipseCurve extends Curve<Vector2> {

		constructor(
			aX: number,
			aY: number,
			xRadius: number,
			yRadius: number,
			aStartAngle: number,
			aEndAngle: number,
			aClockwise: boolean,
			aRotation: number
		);

		aX: number;
		aY: number;
		xRadius: number;
		yRadius: number;
		aStartAngle: number;
		aEndAngle: number;
		aClockwise: boolean;
		aRotation: number;

	}


	export class LineCurve extends Curve<Vector2> {

		constructor(v1: Vector2, v2: Vector2);

		v1: Vector2;
		v2: Vector2;

	}


	export class LineCurve3 extends Curve<Vector3> {

		constructor(v1: Vector3, v2: Vector3);

		v1: Vector3;
		v2: Vector3;

	}


	export class QuadraticBezierCurve extends Curve<Vector2> {

		constructor(v0: Vector2, v1: Vector2, v2: Vector2);

		v0: Vector2;
		v1: Vector2;
		v2: Vector2;

	}


	export class QuadraticBezierCurve3 extends Curve<Vector3> {

		constructor(v0: Vector3, v1: Vector3, v2: Vector3);

		v0: Vector3;
		v1: Vector3;
		v2: Vector3;

	}


	export class SplineCurve extends Curve<Vector2> {

		constructor(points?: Vector2[]);

		points: Vector2[];

	}


	export namespace ImageUtils {

		export function getDataURL(
			image: any,
		): string;

		/**
		 * @deprecated
		 */
		export let crossOrigin: string;

		/**
		 * @deprecated Use {@link TextureLoader THREE.TextureLoader()} instead.
		 */
		export function loadTexture(
			url: string,
			mapping?: Mapping,
			onLoad?: (texture: Texture) => void,
			onError?: (message: string) => void
		): Texture;

		/**
		 * @deprecated Use {@link CubeTextureLoader THREE.CubeTextureLoader()} instead.
		 */
		export function loadTextureCube(
			array: string[],
			mapping?: Mapping,
			onLoad?: (texture: Texture) => void,
			onError?: (message: string) => void
		): Texture;
	}


	// Extras / Objects /////////////////////////////////////////////////////////////////////

	export class ImmediateRenderObject extends Object3D {

		constructor(material: Material);

		material: Material;
		render(renderCallback: Function): void;

	}


	export class PMREMGenerator {

		constructor(renderer: WebGLRenderer);
		fromScene(scene: Scene, sigma?: number, near?: number, far?: number): WebGLRenderTarget;
		fromEquirectangular(equirectangular: Texture): WebGLRenderTarget;
		fromCubemap(cubemap: CubeTexture): WebGLRenderTarget;
		compileCubemapShader(): void;
		compileEquirectangularShader(): void;
		dispose(): void;

	}

	interface Vec2 {
		x: number;
		y: number;
	}

	export namespace ShapeUtils {
		export function area(contour: Vec2[]): number;
		export function triangulateShape(contour: Vec2[], holes: Vec2[][]): number[][];
		export function isClockWise(pts: Vec2[]): boolean;
	}


	// Extras / Geometries /////////////////////////////////////////////////////////////////////
	export class BoxBufferGeometry extends BufferGeometry {

		constructor(
			width?: number,
			height?: number,
			depth?: number,
			widthSegments?: number,
			heightSegments?: number,
			depthSegments?: number
		);

		parameters: {
			width: number;
			height: number;
			depth: number;
			widthSegments: number;
			heightSegments: number;
			depthSegments: number;
		};

	}

	/**
	 * BoxGeometry is the quadrilateral primitive geometry class. It is typically used for creating a cube or irregular quadrilateral of the dimensions provided within the (optional) 'width', 'height', & 'depth' constructor arguments.
	 */
	export class BoxGeometry extends Geometry {

		/**
		 * @param width — Width of the sides on the X axis.
		 * @param height — Height of the sides on the Y axis.
		 * @param depth — Depth of the sides on the Z axis.
		 * @param widthSegments — Number of segmented faces along the width of the sides.
		 * @param heightSegments — Number of segmented faces along the height of the sides.
		 * @param depthSegments — Number of segmented faces along the depth of the sides.
		 */
		constructor(
			width?: number,
			height?: number,
			depth?: number,
			widthSegments?: number,
			heightSegments?: number,
			depthSegments?: number
		);

		parameters: {
			width: number;
			height: number;
			depth: number;
			widthSegments: number;
			heightSegments: number;
			depthSegments: number;
		};

	}


	export class CircleBufferGeometry extends BufferGeometry {

		constructor(
			radius?: number,
			segments?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radius: number;
			segments: number;
			thetaStart: number;
			thetaLength: number;
		};

	}

	export class CircleGeometry extends Geometry {

		constructor(
			radius?: number,
			segments?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radius: number;
			segments: number;
			thetaStart: number;
			thetaLength: number;
		};

	}


	export class ConeBufferGeometry extends CylinderBufferGeometry {

		constructor(
			radius?: number,
			height?: number,
			radialSegment?: number,
			heightSegment?: number,
			openEnded?: boolean,
			thetaStart?: number,
			thetaLength?: number
		);

	}

	export class ConeGeometry extends CylinderGeometry {

		constructor(
			radius?: number,
			height?: number,
			radialSegment?: number,
			heightSegment?: number,
			openEnded?: boolean,
			thetaStart?: number,
			thetaLength?: number
		);

	}


	export class CylinderBufferGeometry extends BufferGeometry {

		constructor(
			radiusTop?: number,
			radiusBottom?: number,
			height?: number,
			radialSegments?: number,
			heightSegments?: number,
			openEnded?: boolean,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radiusTop: number;
			radiusBottom: number;
			height: number;
			radialSegments: number;
			heightSegments: number;
			openEnded: boolean;
			thetaStart: number;
			thetaLength: number;
		};

	}

	export class CylinderGeometry extends Geometry {

		/**
		 * @param radiusTop — Radius of the cylinder at the top.
		 * @param radiusBottom — Radius of the cylinder at the bottom.
		 * @param height — Height of the cylinder.
		 * @param radiusSegments — Number of segmented faces around the circumference of the cylinder.
		 * @param heightSegments — Number of rows of faces along the height of the cylinder.
		 * @param openEnded - A Boolean indicating whether or not to cap the ends of the cylinder.
		 */
		constructor(
			radiusTop?: number,
			radiusBottom?: number,
			height?: number,
			radiusSegments?: number,
			heightSegments?: number,
			openEnded?: boolean,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radiusTop: number;
			radiusBottom: number;
			height: number;
			radialSegments: number;
			heightSegments: number;
			openEnded: boolean;
			thetaStart: number;
			thetaLength: number;
		};

	}


	export class DodecahedronBufferGeometry extends PolyhedronBufferGeometry {

		constructor(radius?: number, detail?: number);

	}

	export class DodecahedronGeometry extends Geometry {

		constructor(radius?: number, detail?: number);

		parameters: {
			radius: number;
			detail: number;
		};

	}


	export class EdgesGeometry extends BufferGeometry {

		constructor(geometry: BufferGeometry | Geometry, thresholdAngle?: number);

	}


	export interface ExtrudeGeometryOptions {
		curveSegments?: number;
		steps?: number;
		depth?: number;
		bevelEnabled?: boolean;
		bevelThickness?: number;
		bevelSize?: number;
		bevelOffset?: number;
		bevelSegments?: number;
		extrudePath?: Curve<Vector3>;
		UVGenerator?: UVGenerator;
	}

	export interface UVGenerator {
		generateTopUV(
			geometry: ExtrudeBufferGeometry,
			vertices: number[],
			indexA: number,
			indexB: number,
			indexC: number
		): Vector2[];
		generateSideWallUV(
			geometry: ExtrudeBufferGeometry,
			vertices: number[],
			indexA: number,
			indexB: number,
			indexC: number,
			indexD: number
		): Vector2[];
	}

	export class ExtrudeBufferGeometry extends BufferGeometry {

		constructor(shapes: Shape | Shape[], options?: ExtrudeGeometryOptions);

		static WorldUVGenerator: UVGenerator;

		addShapeList(shapes: Shape[], options?: any): void;
		addShape(shape: Shape, options?: any): void;

	}

	export class ExtrudeGeometry extends Geometry {

		constructor(shapes: Shape | Shape[], options?: ExtrudeGeometryOptions);

		static WorldUVGenerator: UVGenerator;

		addShapeList(shapes: Shape[], options?: any): void;
		addShape(shape: Shape, options?: any): void;

	}



	export class IcosahedronBufferGeometry extends PolyhedronBufferGeometry {

		constructor(radius?: number, detail?: number);

	}

	export class IcosahedronGeometry extends PolyhedronGeometry {

		constructor(radius?: number, detail?: number);

	}


	export class LatheBufferGeometry extends BufferGeometry {

		constructor(
			points: Vector2[],
			segments?: number,
			phiStart?: number,
			phiLength?: number
		);

		parameters: {
			points: Vector2[];
			segments: number;
			phiStart: number;
			phiLength: number;
		};

	}

	export class LatheGeometry extends Geometry {

		constructor(
			points: Vector2[],
			segments?: number,
			phiStart?: number,
			phiLength?: number
		);

		parameters: {
			points: Vector2[];
			segments: number;
			phiStart: number;
			phiLength: number;
		};

	}

	export class OctahedronBufferGeometry extends PolyhedronBufferGeometry {

		constructor(radius?: number, detail?: number);

	}

	export class OctahedronGeometry extends PolyhedronGeometry {

		constructor(radius?: number, detail?: number);

	}


	export class ParametricBufferGeometry extends BufferGeometry {

		constructor(
			func: (u: number, v: number, dest: Vector3) => void,
			slices: number,
			stacks: number
		);

		parameters: {
			func: (u: number, v: number, dest: Vector3) => void;
			slices: number;
			stacks: number;
		};

	}

	export class ParametricGeometry extends Geometry {

		constructor(
			func: (u: number, v: number, dest: Vector3) => void,
			slices: number,
			stacks: number
		);

		parameters: {
			func: (u: number, v: number, dest: Vector3) => void;
			slices: number;
			stacks: number;
		};

	}


	export class PlaneBufferGeometry extends BufferGeometry {

		constructor(
			width?: number,
			height?: number,
			widthSegments?: number,
			heightSegments?: number
		);

		parameters: {
			width: number;
			height: number;
			widthSegments: number;
			heightSegments: number;
		};

	}

	export class PlaneGeometry extends Geometry {

		constructor(
			width?: number,
			height?: number,
			widthSegments?: number,
			heightSegments?: number
		);

		parameters: {
			width: number;
			height: number;
			widthSegments: number;
			heightSegments: number;
		};

	}


	export class PolyhedronBufferGeometry extends BufferGeometry {

		constructor(
			vertices: number[],
			indices: number[],
			radius?: number,
			detail?: number
		);

		parameters: {
			vertices: number[];
			indices: number[];
			radius: number;
			detail: number;
		};

	}

	export class PolyhedronGeometry extends Geometry {

		constructor(
			vertices: number[],
			indices: number[],
			radius?: number,
			detail?: number
		);

		parameters: {
			vertices: number[];
			indices: number[];
			radius: number;
			detail: number;
		};
		boundingSphere: Sphere;

	}


	export class RingBufferGeometry extends BufferGeometry {

		constructor(
			innerRadius?: number,
			outerRadius?: number,
			thetaSegments?: number,
			phiSegments?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			innerRadius: number;
			outerRadius: number;
			thetaSegments: number;
			phiSegments: number;
			thetaStart: number;
			thetaLength: number;
		};

	}

	export class RingGeometry extends Geometry {

		constructor(
			innerRadius?: number,
			outerRadius?: number,
			thetaSegments?: number,
			phiSegments?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			innerRadius: number;
			outerRadius: number;
			thetaSegments: number;
			phiSegments: number;
			thetaStart: number;
			thetaLength: number;
		};

	}


	export class ShapeBufferGeometry extends BufferGeometry {

		constructor(shapes: Shape | Shape[], curveSegments?: number);

	}

	export class ShapeGeometry extends Geometry {

		constructor(shapes: Shape | Shape[], curveSegments?: number);

		addShapeList(shapes: Shape[], options: any): ShapeGeometry;
		addShape(shape: Shape, options?: any): void;

	}


	export class SphereBufferGeometry extends BufferGeometry {

		constructor(
			radius?: number,
			widthSegments?: number,
			heightSegments?: number,
			phiStart?: number,
			phiLength?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radius: number;
			widthSegments: number;
			heightSegments: number;
			phiStart: number;
			phiLength: number;
			thetaStart: number;
			thetaLength: number;
		};

	}

	/**
	 * A class for generating sphere geometries
	 */
	export class SphereGeometry extends Geometry {

		/**
		 * The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep) and the Z axis (vertical sweep). Thus, incomplete spheres (akin to 'sphere slices') can be created through the use of different values of phiStart, phiLength, thetaStart and thetaLength, in order to define the points in which we start (or end) calculating those vertices.
		 *
		 * @param radius — sphere radius. Default is 50.
		 * @param widthSegments — number of horizontal segments. Minimum value is 3, and the default is 8.
		 * @param heightSegments — number of vertical segments. Minimum value is 2, and the default is 6.
		 * @param phiStart — specify horizontal starting angle. Default is 0.
		 * @param phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
		 * @param thetaStart — specify vertical starting angle. Default is 0.
		 * @param thetaLength — specify vertical sweep angle size. Default is Math.PI.
		 */
		constructor(
			radius?: number,
			widthSegments?: number,
			heightSegments?: number,
			phiStart?: number,
			phiLength?: number,
			thetaStart?: number,
			thetaLength?: number
		);

		parameters: {
			radius: number;
			widthSegments: number;
			heightSegments: number;
			phiStart: number;
			phiLength: number;
			thetaStart: number;
			thetaLength: number;
		};

	}


	export class TetrahedronBufferGeometry extends PolyhedronBufferGeometry {

		constructor(radius?: number, detail?: number);

	}

	export class TetrahedronGeometry extends PolyhedronGeometry {

		constructor(radius?: number, detail?: number);

	}


	export interface TextGeometryParameters {
		font: Font;
		size?: number;
		height?: number;
		curveSegments?: number;
		bevelEnabled?: boolean;
		bevelThickness?: number;
		bevelSize?: number;
		bevelOffset?: number;
		bevelSegments?: number;
	}

	export class TextBufferGeometry extends ExtrudeBufferGeometry {

		constructor(text: string, parameters: TextGeometryParameters);

		parameters: {
			font: Font;
			size: number;
			height: number;
			curveSegments: number;
			bevelEnabled: boolean;
			bevelThickness: number;
			bevelSize: number;
			bevelOffset: number;
			bevelSegments: number;
		};

	}

	export class TextGeometry extends ExtrudeGeometry {

		constructor(text: string, parameters: TextGeometryParameters);

		parameters: {
			font: Font;
			size: number;
			height: number;
			curveSegments: number;
			bevelEnabled: boolean;
			bevelThickness: number;
			bevelSize: number;
			bevelOffset: number;
			bevelSegments: number;
		};

	}


	export class TorusBufferGeometry extends BufferGeometry {

		constructor(
			radius?: number,
			tube?: number,
			radialSegments?: number,
			tubularSegments?: number,
			arc?: number
		);

		parameters: {
			radius: number;
			tube: number;
			radialSegments: number;
			tubularSegments: number;
			arc: number;
		};

	}

	export class TorusGeometry extends Geometry {

		constructor(
			radius?: number,
			tube?: number,
			radialSegments?: number,
			tubularSegments?: number,
			arc?: number
		);

		parameters: {
			radius: number;
			tube: number;
			radialSegments: number;
			tubularSegments: number;
			arc: number;
		};

	}


	export class TorusKnotBufferGeometry extends BufferGeometry {

		constructor(
			radius?: number,
			tube?: number,
			tubularSegments?: number,
			radialSegments?: number,
			p?: number,
			q?: number
		);

		parameters: {
			radius: number;
			tube: number;
			tubularSegments: number;
			radialSegments: number;
			p: number;
			q: number;
			heightScale: number;
		};

	}

	export class TorusKnotGeometry extends Geometry {

		constructor(
			radius?: number,
			tube?: number,
			tubularSegments?: number,
			radialSegments?: number,
			p?: number,
			q?: number
		);

		parameters: {
			radius: number;
			tube: number;
			tubularSegments: number;
			radialSegments: number;
			p: number;
			q: number;
			heightScale: number;
		};

	}


	export class TubeBufferGeometry extends BufferGeometry {

		constructor(
			path: Curve<Vector3>,
			tubularSegments?: number,
			radius?: number,
			radiusSegments?: number,
			closed?: boolean
		);

		parameters: {
			path: Curve<Vector3>;
			tubularSegments: number;
			radius: number;
			radialSegments: number;
			closed: boolean;
		};
		tangents: Vector3[];
		normals: Vector3[];
		binormals: Vector3[];

	}

	export class TubeGeometry extends Geometry {

		constructor(
			path: Curve<Vector3>,
			tubularSegments?: number,
			radius?: number,
			radiusSegments?: number,
			closed?: boolean
		);

		parameters: {
			path: Curve<Vector3>;
			tubularSegments: number;
			radius: number;
			radialSegments: number;
			closed: boolean;
		};
		tangents: Vector3[];
		normals: Vector3[];
		binormals: Vector3[];

	}


	export class WireframeGeometry extends BufferGeometry {

		constructor(geometry: Geometry | BufferGeometry);

	}


	// Extras / Helpers /////////////////////////////////////////////////////////////////////

	export class ArrowHelper extends Object3D {

		constructor(
			dir: Vector3,
			origin?: Vector3,
			length?: number,
			color?: number,
			headLength?: number,
			headWidth?: number
		);

		line: Line;
		cone: Mesh;

		setDirection(dir: Vector3): void;
		setLength(length: number, headLength?: number, headWidth?: number): void;
		setColor(color: Color | string | number): void;

	}


	export class AxesHelper extends LineSegments {

		constructor(size?: number);

	}


	export class Box3Helper extends LineSegments {

		constructor(box: Box3, color?: Color);

		box: Box3;

	}


	export class BoxHelper extends LineSegments {

		constructor(object: Object3D, color?: Color | string | number);

		update(object?: Object3D): void;

		setFromObject(object: Object3D): this;

	}


	export class CameraHelper extends LineSegments {

		constructor(camera: Camera);

		camera: Camera;
		pointMap: { [id: string]: number[] };

		update(): void;

	}


	export class DirectionalLightHelper extends Object3D {

		constructor(
			light: DirectionalLight,
			size?: number,
			color?: Color | string | number
		);

		light: DirectionalLight;
		lightPlane: Line;
		targetLine: Line;
		color: Color | string | number | undefined;
		matrix: Matrix4;
		matrixAutoUpdate: boolean;

		dispose(): void;
		update(): void;

	}


	export class GridHelper extends LineSegments {

		constructor(
			size: number,
			divisions: number,
			color1?: Color | number,
			color2?: Color | number
		);
		/**
		 * @deprecated Colors should be specified in the constructor.
		 */
		setColors(color1?: Color | number, color2?: Color | number): void;

	}


	export class HemisphereLightHelper extends Object3D {

		constructor(
			light: HemisphereLight,
			size: number,
			color?: Color | number | string
		);

		light: HemisphereLight;
		matrix: Matrix4;
		matrixAutoUpdate: boolean;
		material: MeshBasicMaterial;

		color: Color | string | number | undefined;

		dispose(): void;
		update(): void;

	}


	export class PlaneHelper extends LineSegments {

		constructor(plane: Plane, size?: number, hex?: number);

		plane: Plane;
		size: number;

		updateMatrixWorld(force?: boolean): void;

	}


	export class PointLightHelper extends Object3D {

		constructor(
			light: PointLight,
			sphereSize?: number,
			color?: Color | string | number
		);

		light: PointLight;
		color: Color | string | number | undefined;
		matrix: Matrix4;
		matrixAutoUpdate: boolean;

		dispose(): void;
		update(): void;

	}


	export class PolarGridHelper extends LineSegments {

		constructor(
			radius: number,
			radials: number,
			circles: number,
			divisions: number,
			color1: Color | string | number | undefined,
			color2: Color | string | number | undefined
		);

	}


	export class SkeletonHelper extends LineSegments {

		constructor(object: Object3D);

		bones: Bone[];
		root: Object3D;

		readonly isSkeletonHelper: true;

		getBoneList(object: Object3D): Bone[];
		update(): void;

	}


	export class SpotLightHelper extends Object3D {

		constructor(light: Light, color?: Color | string | number);

		light: Light;
		matrix: Matrix4;
		matrixAutoUpdate: boolean;
		color: Color | string | number | undefined;
		cone: LineSegments;

		dispose(): void;
		update(): void;

	}


	/**
	 * This light's color gets applied to all the objects in the scene globally.
	 *
	 * @source https://github.com/mrdoob/three.js/blob/master/src/lights/AmbientLight.js
	 */
	export class AmbientLight extends Light {

		/**
		 * This creates a Ambientlight with a color.
		 * @param color Numeric value of the RGB component of the color or a Color instance.
		 */
		constructor(color?: Color | string | number, intensity?: number);

		castShadow: boolean;
		readonly isAmbientLight: true;

	}


	export class AmbientLightProbe extends LightProbe {

		constructor(color?: Color | string | number, intensity?: number);

		readonly isAmbientLightProbe: true;

	}


	/**
	 * @example
	 * // White directional light at half intensity shining from the top.
	 * var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	 * directionalLight.position.set( 0, 1, 0 );
	 * scene.add( directionalLight );
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/lights/DirectionalLight.js">src/lights/DirectionalLight.js</a>
	 */
	export class DirectionalLight extends Light {

		constructor(color?: Color | string | number, intensity?: number);

		/**
		 * Target used for shadow camera orientation.
		 */
		target: Object3D;

		/**
		 * Light's intensity.
		 * Default — 1.0.
		 */
		intensity: number;

		shadow: DirectionalLightShadow;
		readonly isDirectionalLight: true;

	}


	export class DirectionalLightShadow extends LightShadow {

		camera: OrthographicCamera;
		readonly isDirectionalLightShadow: true;

	}


	export class HemisphereLight extends Light {

		constructor(
			skyColor?: Color | string | number,
			groundColor?: Color | string | number,
			intensity?: number
		);

		skyColor: Color;
		groundColor: Color;
		intensity: number;
		readonly isHemisphereLight: true;

	}


	export class HemisphereLightProbe extends LightProbe {

		constructor(skyColor?: Color | string | number, groundColor?: Color | string | number, intensity?: number);

		readonly isHemisphereLightProbe: true;

	}


	// Lights //////////////////////////////////////////////////////////////////////////////////

	/**
	 * Abstract base class for lights.
	 */
	export class Light extends Object3D {

		constructor(hex?: number | string, intensity?: number);

		color: Color;
		intensity: number;
		readonly isLight: true;
		receiveShadow: boolean;
		shadow: LightShadow;
		/**
		 * @deprecated Use shadow.camera.fov instead.
		 */
		shadowCameraFov: any;
		/**
		 * @deprecated Use shadow.camera.left instead.
		 */
		shadowCameraLeft: any;
		/**
		 * @deprecated Use shadow.camera.right instead.
		 */
		shadowCameraRight: any;
		/**
		 * @deprecated Use shadow.camera.top instead.
		 */
		shadowCameraTop: any;
		/**
		 * @deprecated Use shadow.camera.bottom instead.
		 */
		shadowCameraBottom: any;
		/**
		 * @deprecated Use shadow.camera.near instead.
		 */
		shadowCameraNear: any;
		/**
		 * @deprecated Use shadow.camera.far instead.
		 */
		shadowCameraFar: any;
		/**
		 * @deprecated Use shadow.bias instead.
		 */
		shadowBias: any;
		/**
		 * @deprecated Use shadow.mapSize.width instead.
		 */
		shadowMapWidth: any;
		/**
		 * @deprecated Use shadow.mapSize.height instead.
		 */
		shadowMapHeight: any;

	}


	export class LightProbe extends Light {

		constructor(sh?: SphericalHarmonics3, intensity?: number);

		readonly isLightProbe: true;
		sh: SphericalHarmonics3;

		fromJSON(json: any): LightProbe;

	}


	export class LightShadow {

		constructor(camera: Camera);

		camera: Camera;
		bias: number;
		radius: number;
		mapSize: Vector2;
		map: RenderTarget;
		mapPass: RenderTarget;
		matrix: Matrix4;

		copy(source: LightShadow): this;
		clone(recursive?: boolean): this;
		toJSON(): any;
		getFrustum(): number;
		updateMatrices(light: Light, viewportIndex?: number): void;
		getViewport(viewportIndex: number): Vector4;
		getFrameExtents(): Vector2;

	}


	/**
	 * @example
	 * var light = new THREE.PointLight( 0xff0000, 1, 100 );
	 * light.position.set( 50, 50, 50 );
	 * scene.add( light );
	 */
	export class PointLight extends Light {

		constructor(
			color?: Color | string | number,
			intensity?: number,
			distance?: number,
			decay?: number
		);

		/*
		 * Light's intensity.
		 * Default - 1.0.
		 */
		intensity: number;

		/**
		 * If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance.
		 * Default - 0.0.
		 */
		distance: number;

		decay: number;
		shadow: PointLightShadow;
		power: number;

	}


	export class PointLightShadow extends LightShadow {

		camera: PerspectiveCamera;

	}


	export class RectAreaLight extends Light {

		constructor(
			color?: Color | string | number,
			intensity?: number,
			width?: number,
			height?: number
		);

		type: string;
		width: number;
		height: number;
		intensity: number;
		readonly isRectAreaLight: true;

	}


	/**
	 * A point light that can cast shadow in one direction.
	 */
	export class SpotLight extends Light {

		constructor(
			color?: Color | string | number,
			intensity?: number,
			distance?: number,
			angle?: number,
			penumbra?: number,
			decay?: number
		);

		/**
		 * Spotlight focus points at target.position.
		 * Default position — (0,0,0).
		 */
		target: Object3D;

		/**
		 * Light's intensity.
		 * Default — 1.0.
		 */
		intensity: number;

		/**
		 * If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance.
		 * Default — 0.0.
		 */
		distance: number;

		/*
		 * Maximum extent of the spotlight, in radians, from its direction.
		 * Default — Math.PI/2.
		 */
		angle: number;

		decay: number;
		shadow: SpotLightShadow;
		power: number;
		penumbra: number;
		readonly isSpotLight: true;

	}


	export class SpotLightShadow extends LightShadow {

		camera: PerspectiveCamera;
		readonly isSpotLightShadow: true;

	}


	export class AnimationLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad: (response: AnimationClip[]) => void,
			onProgress?: (request: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;
		parse(json: any): AnimationClip[];

	}


	export class AudioLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad: (audioBuffer: AudioBuffer) => void,
			onProgress?: (request: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;

	}


	export class BufferGeometryLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad: (bufferGeometry: InstancedBufferGeometry | BufferGeometry) => void,
			onProgress?: (request: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;
		parse(json: any): InstancedBufferGeometry | BufferGeometry;

	}

	export namespace Cache {
		export let enabled: boolean;
		export let files: any;

		export function add(key: string, file: any): void;
		export function get(key: string): any;
		export function remove(key: string): void;
		export function clear(): void;
	}


	export class CompressedTextureLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad: (texture: CompressedTexture) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;

	}


	export class CubeTextureLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			urls: Array<string>,
			onLoad?: (texture: CubeTexture) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): CubeTexture;

	}


	export class DataTextureLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad: (dataTexture: DataTexture) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;

	}


	export class FileLoader extends Loader {

		constructor(manager?: LoadingManager);

		mimeType: undefined | MimeType;
		responseType: undefined | string;
		withCredentials: undefined | string;
		requestHeader: undefined | { [header: string]: string };

		load(
			url: string,
			onLoad?: (response: string | ArrayBuffer) => void,
			onProgress?: (request: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): any;
		setMimeType(mimeType: MimeType): FileLoader;
		setResponseType(responseType: string): FileLoader;
		setWithCredentials(value: boolean): FileLoader;
		setRequestHeader(value: { [header: string]: string }): FileLoader;

	}


	export class FontLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad?: (responseFont: Font) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): void;
		parse(json: any): Font;

	}


	export class ImageBitmapLoader extends Loader {

		constructor(manager?: LoadingManager);

		options: undefined | any;

		setOptions(options: any): ImageBitmapLoader;
		load(
			url: string,
			//onLoad?: (response: ImageBitmap) => void,
			onLoad?: (response) => void,
			onProgress?: (request: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): any;

	}


	/**
	 * A loader for loading an image.
	 * Unlike other loaders, this one emits events instead of using predefined callbacks. So if you're interested in getting notified when things happen, you need to add listeners to the object.
	 */
	export class ImageLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad?: (image: HTMLImageElement) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): HTMLImageElement;

	}


	/**
	 * Base class for implementing loaders.
	 */
	export class Loader {

		constructor(manager?: LoadingManager);

		crossOrigin: string;
		path: string;
		resourcePath: string;
		manager: LoadingManager;

		/*
		load(): void;
		parse(): void;
		*/

		loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<any>;

		setCrossOrigin(crossOrigin: string): this;
		setPath(path: string): this;
		setResourcePath(resourcePath: string): this;

	}


	export class LoaderUtils {

		static decodeText(array: TypedArray): string;
		static extractUrlBase(url: string): string;

	}


	export const DefaultLoadingManager: LoadingManager;

	/**
	 * Handles and keeps track of loaded and pending data.
	 */
	export class LoadingManager {

		constructor(
			onLoad?: () => void,
			onProgress?: (url: string, loaded: number, total: number) => void,
			onError?: (url: string) => void
		);

		/**
		 * Will be called when loading of an item starts.
		 * @param url The url of the item that started loading.
		 * @param loaded The number of items already loaded so far.
		 * @param total The total amount of items to be loaded.
		 */
		onStart?: (url: string, loaded: number, total: number) => void;

		/**
		 * Will be called when all items finish loading.
		 * The default is a function with empty body.
		 */
		onLoad: () => void;

		/**
		 * Will be called for each loaded item.
		 * The default is a function with empty body.
		 * @param url The url of the item just loaded.
		 * @param loaded The number of items already loaded so far.
		 * @param total The total amount of items to be loaded.
		 */
		onProgress: (url: string, loaded: number, total: number) => void;

		/**
		 * Will be called when item loading fails.
		 * The default is a function with empty body.
		 * @param url The url of the item that errored.
		 */
		onError: (url: string) => void;

		/**
		 * If provided, the callback will be passed each resource URL before a request is sent.
		 * The callback may return the original URL, or a new URL to override loading behavior.
		 * This behavior can be used to load assets from .ZIP files, drag-and-drop APIs, and Data URIs.
		 * @param callback URL modifier callback. Called with url argument, and must return resolvedURL.
		 */
		setURLModifier(callback?: (url: string) => string): this;

		/**
		 * Given a URL, uses the URL modifier callback (if any) and returns a resolved URL.
		 * If no URL modifier is set, returns the original URL.
		 * @param url the url to load
		 */
		resolveURL(url: string): string;

		itemStart(url: string): void;
		itemEnd(url: string): void;
		itemError(url: string): void;

		// handlers

		addHandler(regex: RegExp, loader: Loader): this;
		removeHandler(regex: RegExp): this;
		getHandler(file: string): Loader | null;

	}


	export class MaterialLoader extends Loader {

		constructor(manager?: LoadingManager);

		textures: { [key: string]: Texture };

		load(
			url: string,
			onLoad: (material: Material) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: Error | ErrorEvent) => void
		): void;
		setTextures(textures: { [key: string]: Texture }): this;
		parse(json: any): Material;

	}


	export class ObjectLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad?: <ObjectType extends Object3D>(object: ObjectType) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: Error | ErrorEvent) => void
		): void;
		parse<T extends Object3D>(json: any, onLoad?: (object: Object3D) => void): T;
		parseGeometries(json: any): any[]; // Array of BufferGeometry or Geometry or Geometry2.
		parseMaterials(json: any, textures: Texture[]): Material[]; // Array of Classes that inherits from Matrial.
		parseAnimations(json: any): AnimationClip[];
		parseImages(
			json: any,
			onLoad: () => void
		): { [key: string]: HTMLImageElement };
		parseTextures(json: any, images: any): Texture[];
		parseObject<T extends Object3D>(
			data: any,
			geometries: any[],
			materials: Material[]
		): T;

	}


	/**
	 * Class for loading a texture.
	 * Unlike other loaders, this one emits events instead of using predefined callbacks. So if you're interested in getting notified when things happen, you need to add listeners to the object.
	 */
	export class TextureLoader extends Loader {

		constructor(manager?: LoadingManager);

		load(
			url: string,
			onLoad?: (texture: Texture) => void,
			onProgress?: (event: ProgressEvent) => void,
			onError?: (event: ErrorEvent) => void
		): Texture;

	}


	export interface LineBasicMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		linewidth?: number;
		linecap?: string;
		linejoin?: string;
	}

	export class LineBasicMaterial extends Material {

		constructor(parameters?: LineBasicMaterialParameters);

		color: Color;
		linewidth: number;
		linecap: string;
		linejoin: string;

		setValues(parameters: LineBasicMaterialParameters): void;

	}


	export interface LineDashedMaterialParameters extends LineBasicMaterialParameters {
		scale?: number;
		dashSize?: number;
		gapSize?: number;
	}

	export class LineDashedMaterial extends LineBasicMaterial {

		constructor(parameters?: LineDashedMaterialParameters);

		scale: number;
		dashSize: number;
		gapSize: number;
		readonly isLineDashedMaterial: true;

		setValues(parameters: LineDashedMaterialParameters): void;

	}

	// Materials //////////////////////////////////////////////////////////////////////////////////
	export let MaterialIdCount: number;

	export interface MaterialParameters {
		alphaTest?: number;
		blendDst?: BlendingDstFactor;
		blendDstAlpha?: number;
		blendEquation?: BlendingEquation;
		blendEquationAlpha?: number;
		blending?: Blending;
		blendSrc?: BlendingSrcFactor | BlendingDstFactor;
		blendSrcAlpha?: number;
		clipIntersection?: boolean;
		clippingPlanes?: Plane[];
		clipShadows?: boolean;
		colorWrite?: boolean;
		defines?: any;
		depthFunc?: DepthModes;
		depthTest?: boolean;
		depthWrite?: boolean;
		fog?: boolean;
		name?: string;
		opacity?: number;
		polygonOffset?: boolean;
		polygonOffsetFactor?: number;
		polygonOffsetUnits?: number;
		precision?: 'highp' | 'mediump' | 'lowp' | null;
		premultipliedAlpha?: boolean;
		dithering?: boolean;
		flatShading?: boolean;
		side?: Side;
		shadowSide?: Side;
		toneMapped?: boolean;
		transparent?: boolean;
		vertexColors?: boolean;
		visible?: boolean;
		stencilWrite?: boolean;
		stencilFunc?: StencilFunc;
		stencilRef?: number;
		stencilMask?: number;
		stencilFail?: StencilOp;
		stencilZFail?: StencilOp;
		stencilZPass?: StencilOp;
	}

	/**
	 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
	 */
	export class Material extends EventDispatcher {

		constructor();

		/**
		 * Sets the alpha value to be used when running an alpha test. Default is 0.
		 */
		alphaTest: number;

		/**
		 * Blending destination. It's one of the blending mode constants defined in Three.js. Default is {@link OneMinusSrcAlphaFactor}.
		 */
		blendDst: BlendingDstFactor;

		/**
		 * The tranparency of the .blendDst. Default is null.
		 */
		blendDstAlpha: number | null;

		/**
		 * Blending equation to use when applying blending. It's one of the constants defined in Three.js. Default is {@link AddEquation}.
		 */
		blendEquation: BlendingEquation;

		/**
		 * The tranparency of the .blendEquation. Default is null.
		 */
		blendEquationAlpha: number | null;

		/**
		 * Which blending to use when displaying objects with this material. Default is {@link NormalBlending}.
		 */
		blending: Blending;

		/**
		 * Blending source. It's one of the blending mode constants defined in Three.js. Default is {@link SrcAlphaFactor}.
		 */
		blendSrc: BlendingSrcFactor | BlendingDstFactor;

		/**
		 * The tranparency of the .blendSrc. Default is null.
		 */
		blendSrcAlpha: number | null;

		/**
		 * Changes the behavior of clipping planes so that only their intersection is clipped, rather than their union. Default is false.
		 */
		clipIntersection: boolean;

		/**
		 * User-defined clipping planes specified as THREE.Plane objects in world space. These planes apply to the objects this material is attached to. Points in space whose signed distance to the plane is negative are clipped (not rendered). See the WebGL / clipping /intersection example. Default is null.
		 */
		clippingPlanes: any;

		/**
		 * Defines whether to clip shadows according to the clipping planes specified on this material. Default is false.
		 */
		clipShadows: boolean;

		/**
		 * Whether to render the material's color. This can be used in conjunction with a mesh's .renderOrder property to create invisible objects that occlude other objects. Default is true.
		 */
		colorWrite: boolean;

		/**
		 * Custom defines to be injected into the shader. These are passed in form of an object literal, with key/value pairs. { MY_CUSTOM_DEFINE: '' , PI2: Math.PI * 2 }.
		 * The pairs are defined in both vertex and fragment shaders. Default is undefined.
		 */
		defines: any;

		/**
		 * Which depth function to use. Default is {@link LessEqualDepth}. See the depth mode constants for all possible values.
		 */
		depthFunc: DepthModes;

		/**
		 * Whether to have depth test enabled when rendering this material. Default is true.
		 */
		depthTest: boolean;

		/**
		 * Whether rendering this material has any effect on the depth buffer. Default is true.
		 * When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
		 */
		depthWrite: boolean;

		/**
		 * Whether the material is affected by fog. Default is true.
		 */
		fog: boolean;

		/**
		 * Unique number of this material instance.
		 */
		id: number;

		/**
	   * Whether rendering this material has any effect on the stencil buffer. Default is *false*.
	   */
		stencilWrite: boolean;

		/**
	   * The stencil comparison function to use. Default is {@link AlwaysStencilFunc}. See stencil operation constants for all possible values.
	   */
		stencilFunc: StencilFunc;

		/**
	   * The value to use when performing stencil comparisons or stencil operations. Default is *0*.
	   */
		stencilRef: number;

		/**
	   * The bit mask to use when comparing against or writing to the stencil buffer. Default is *0xFF*.
	   */
		stencilMask: number;

		/**
	   * Which stencil operation to perform when the comparison function returns false. Default is {@link KeepStencilOp}. See the stencil operation constants for all possible values.
	   */
		stencilFail: StencilOp;

		/**
	   * Which stencil operation to perform when the comparison function returns true but the depth test fails. Default is {@link KeepStencilOp}. See the stencil operation constants for all possible values.
	   */
		stencilZFail: StencilOp;

		/**
	   * Which stencil operation to perform when the comparison function returns true and the depth test passes. Default is {@link KeepStencilOp}. See the stencil operation constants for all possible values.
	   */
		stencilZPass: StencilOp;

		/**
		 * Used to check whether this or derived classes are materials. Default is true.
		 * You should not change this, as it used internally for optimisation.
		 */
		readonly isMaterial: true;

		/**
		 * Material name. Default is an empty string.
		 */
		name: string;

		/**
		 * Specifies that the material needs to be updated, WebGL wise. Set it to true if you made changes that need to be reflected in WebGL.
		 * This property is automatically set to true when instancing a new material.
		 */
		needsUpdate: boolean;

		/**
		 * Opacity. Default is 1.
		 */
		opacity: number;

		/**
		 * Whether to use polygon offset. Default is false. This corresponds to the POLYGON_OFFSET_FILL WebGL feature.
		 */
		polygonOffset: boolean;

		/**
		 * Sets the polygon offset factor. Default is 0.
		 */
		polygonOffsetFactor: number;

		/**
		 * Sets the polygon offset units. Default is 0.
		 */
		polygonOffsetUnits: number;

		/**
		 * Override the renderer's default precision for this material. Can be "highp", "mediump" or "lowp". Defaults is null.
		 */
		precision: 'highp' | 'mediump' | 'lowp' | null;

		/**
		 * Whether to premultiply the alpha (transparency) value. See WebGL / Materials / Transparency for an example of the difference. Default is false.
		 */
		premultipliedAlpha: boolean;

		/**
		 * Whether to apply dithering to the color to remove the appearance of banding. Default is false.
		 */
		dithering: boolean;

		/**
		 * Define whether the material is rendered with flat shading. Default is false.
		 */
		flatShading: boolean;

		/**
		 * Defines which of the face sides will be rendered - front, back or both.
		 * Default is THREE.FrontSide. Other options are THREE.BackSide and THREE.DoubleSide.
		 */
		side: Side;

		/**
		 * Defines which of the face sides will cast shadows. Default is *null*.
		 * If *null*, the value is opposite that of side, above.
		 */
		shadowSide: Side;

		/**
		 * Defines whether this material is tone mapped according to the renderer's toneMapping setting.
		 * Default is true.
		 */
		toneMapped: boolean;

		/**
		 * Defines whether this material is transparent. This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
		 * When set to true, the extent to which the material is transparent is controlled by setting it's .opacity property.
		 * Default is false.
		 */
		transparent: boolean;

		/**
		 * Value is the string 'Material'. This shouldn't be changed, and can be used to find all objects of this type in a scene.
		 */
		type: string;

		/**
		 * UUID of this material instance. This gets automatically assigned, so this shouldn't be edited.
		 */
		uuid: string;

		/**
		 * Defines whether vertex coloring is used. Default is false.
		 */
		vertexColors: boolean;

		/**
		 * Defines whether this material is visible. Default is true.
		 */
		visible: boolean;

		/**
		 * An object that can be used to store custom data about the Material. It should not hold references to functions as these will not be cloned.
		 */
		userData: any;

		/**
		 * This starts at 0 and counts how many times .needsUpdate is set to true.
		 */
		version: number;

		/**
		 * Return a new material with the same parameters as this material.
		 */
		clone(): this;

		/**
		 * Copy the parameters from the passed material into this material.
		 * @param material
		 */
		copy(material: Material): this;

		/**
		 * This disposes the material. Textures of a material don't get disposed. These needs to be disposed by {@link Texture}.
		 */
		dispose(): void;

		/**
		 * An optional callback that is executed immediately before the shader program is compiled. This function is called with the shader source code as a parameter. Useful for the modification of built-in materials.
		 * @param shader Source code of the shader
		 * @param renderer WebGLRenderer Context that is initializing the material
		 */
		onBeforeCompile(shader: Shader, renderer: WebGLRenderer): void;

		/**
		 * Sets the properties based on the values.
		 * @param values A container with parameters.
		 */
		setValues(values: MaterialParameters): void;

		/**
		 * Convert the material to three.js JSON format.
		 * @param meta Object containing metadata such as textures or images for the material.
		 */
		toJSON(meta?: any): any;

	}

	/**
	 * parameters is an object with one or more properties defining the material's appearance.
	 */
	export interface MeshBasicMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		opacity?: number;
		map?: Texture | null;
		aoMap?: Texture | null;
		aoMapIntensity?: number;
		specularMap?: Texture | null;
		alphaMap?: Texture | null;
		envMap?: Texture | null;
		combine?: Combine;
		reflectivity?: number;
		refractionRatio?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		wireframeLinecap?: string;
		wireframeLinejoin?: string;
		skinning?: boolean;
		morphTargets?: boolean;
	}

	export class MeshBasicMaterial extends Material {

		constructor(parameters?: MeshBasicMaterialParameters);

		color: Color;
		map: Texture | null;
		aoMap: Texture | null;
		aoMapIntensity: number;
		specularMap: Texture | null;
		alphaMap: Texture | null;
		envMap: Texture | null;
		combine: Combine;
		reflectivity: number;
		refractionRatio: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		wireframeLinecap: string;
		wireframeLinejoin: string;
		skinning: boolean;
		morphTargets: boolean;

		setValues(parameters: MeshBasicMaterialParameters): void;

	}


	export interface MeshDepthMaterialParameters extends MaterialParameters {
		map?: Texture | null;
		alphaMap?: Texture | null;
		depthPacking?: DepthPackingStrategies;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
	}

	export class MeshDepthMaterial extends Material {

		constructor(parameters?: MeshDepthMaterialParameters);

		map: Texture | null;
		alphaMap: Texture | null;
		depthPacking: DepthPackingStrategies;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		wireframe: boolean;
		wireframeLinewidth: number;

		setValues(parameters: MeshDepthMaterialParameters): void;

	}


	export interface MeshDistanceMaterialParameters extends MaterialParameters {
		map?: Texture | null;
		alphaMap?: Texture | null;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		farDistance?: number;
		nearDistance?: number;
		referencePosition?: Vector3;
	}

	export class MeshDistanceMaterial extends Material {

		constructor(parameters?: MeshDistanceMaterialParameters);

		map: Texture | null;
		alphaMap: Texture | null;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		farDistance: number;
		nearDistance: number;
		referencePosition: Vector3;

		setValues(parameters: MeshDistanceMaterialParameters): void;

	}


	export interface MeshLambertMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		emissive?: Color | string | number;
		emissiveIntensity?: number;
		emissiveMap?: Texture | null;
		map?: Texture | null;
		lightMap?: Texture | null;
		lightMapIntensity?: number;
		aoMap?: Texture | null;
		aoMapIntensity?: number;
		specularMap?: Texture | null;
		alphaMap?: Texture | null;
		envMap?: Texture | null;
		combine?: Combine;
		reflectivity?: number;
		refractionRatio?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		wireframeLinecap?: string;
		wireframeLinejoin?: string;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshLambertMaterial extends Material {

		constructor(parameters?: MeshLambertMaterialParameters);

		color: Color;
		emissive: Color;
		emissiveIntensity: number;
		emissiveMap: Texture | null;
		map: Texture | null;
		lightMap: Texture | null;
		lightMapIntensity: number;
		aoMap: Texture | null;
		aoMapIntensity: number;
		specularMap: Texture | null;
		alphaMap: Texture | null;
		envMap: Texture | null;
		combine: Combine;
		reflectivity: number;
		refractionRatio: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		wireframeLinecap: string;
		wireframeLinejoin: string;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;

		setValues(parameters: MeshLambertMaterialParameters): void;

	}


	export interface MeshMatcapMaterialParameters extends MaterialParameters {

		color?: Color | string | number;
		matcap?: Texture | null;
		map?: Texture | null;
		bumpMap?: Texture | null;
		bumpScale?: number;
		normalMap?: Texture | null;
		normalMapType?: NormalMapTypes;
		normalScale?: Vector2;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		alphaMap?: Texture | null;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshMatcapMaterial extends Material {

		constructor(parameters?: MeshMatcapMaterialParameters);

		color: Color;
		matcap: Texture | null;
		map: Texture | null;
		bumpMap: Texture | null;
		bumpScale: number;
		normalMap: Texture | null;
		normalMapType: NormalMapTypes;
		normalScale: Vector2;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		alphaMap: Texture | null;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;

		setValues(parameters: MeshMatcapMaterialParameters): void;

	}


	export interface MeshNormalMaterialParameters extends MaterialParameters {

		bumpMap?: Texture | null;
		bumpScale?: number;
		normalMap?: Texture | null;
		normalMapType?: NormalMapTypes;
		normalScale?: Vector2;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshNormalMaterial extends Material {

		constructor(parameters?: MeshNormalMaterialParameters);

		bumpMap: Texture | null;
		bumpScale: number;
		normalMap: Texture | null;
		normalMapType: NormalMapTypes;
		normalScale: Vector2;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;

		setValues(parameters: MeshNormalMaterialParameters): void;

	}


	export interface MeshPhongMaterialParameters extends MaterialParameters {
		/** geometry color in hexadecimal. Default is 0xffffff. */
		color?: Color | string | number;
		specular?: Color | string | number;
		shininess?: number;
		opacity?: number;
		map?: Texture | null;
		lightMap?: Texture | null;
		lightMapIntensity?: number;
		aoMap?: Texture | null;
		aoMapIntensity?: number;
		emissive?: Color | string | number;
		emissiveIntensity?: number;
		emissiveMap?: Texture | null;
		bumpMap?: Texture | null;
		bumpScale?: number;
		normalMap?: Texture | null;
		normalMapType?: NormalMapTypes;
		normalScale?: Vector2;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		specularMap?: Texture | null;
		alphaMap?: Texture | null;
		envMap?: Texture | null;
		combine?: Combine;
		reflectivity?: number;
		refractionRatio?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		wireframeLinecap?: string;
		wireframeLinejoin?: string;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshPhongMaterial extends Material {

		constructor(parameters?: MeshPhongMaterialParameters);

		color: Color;
		specular: Color;
		shininess: number;
		map: Texture | null;
		lightMap: Texture | null;
		lightMapIntensity: number;
		aoMap: Texture | null;
		aoMapIntensity: number;
		emissive: Color;
		emissiveIntensity: number;
		emissiveMap: Texture | null;
		bumpMap: Texture | null;
		bumpScale: number;
		normalMap: Texture | null;
		normalMapType: NormalMapTypes;
		normalScale: Vector2;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		specularMap: Texture | null;
		alphaMap: Texture | null;
		envMap: Texture | null;
		combine: Combine;
		reflectivity: number;
		refractionRatio: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		wireframeLinecap: string;
		wireframeLinejoin: string;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;
		/**
		 * @deprecated Use {@link MeshStandardMaterial THREE.MeshStandardMaterial} instead.
		 */
		metal: boolean;

		setValues(parameters: MeshPhongMaterialParameters): void;

	}

	export interface MeshPhysicalMaterialParameters
		extends MeshStandardMaterialParameters {
		reflectivity?: number;
		clearcoat?: number;
		clearcoatRoughness?: number;

		sheen?: Color;

		clearcoatNormalScale?: Vector2;
		clearcoatNormalMap?: Texture | null;
	}

	export class MeshPhysicalMaterial extends MeshStandardMaterial {

		constructor(parameters: MeshPhysicalMaterialParameters);

		clearcoat: number;
		clearcoatMap: Texture | null;
		clearcoatRoughness: number;
		clearcoatRoughnessMap: Texture | null;
		clearcoatNormalScale: Vector2;
		clearcoatNormalMap: Texture | null;

		reflectivity: number;

		sheen: Color | null;

		transparency: number;

	}


	export interface MeshStandardMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		roughness?: number;
		metalness?: number;
		map?: Texture | null;
		lightMap?: Texture | null;
		lightMapIntensity?: number;
		aoMap?: Texture | null;
		aoMapIntensity?: number;
		emissive?: Color | string | number;
		emissiveIntensity?: number;
		emissiveMap?: Texture | null;
		bumpMap?: Texture | null;
		bumpScale?: number;
		normalMap?: Texture | null;
		normalMapType?: NormalMapTypes;
		normalScale?: Vector2;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		roughnessMap?: Texture | null;
		metalnessMap?: Texture | null;
		alphaMap?: Texture | null;
		envMap?: Texture | null;
		envMapIntensity?: number;
		refractionRatio?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		skinning?: boolean;
		vertexTangents?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshStandardMaterial extends Material {

		constructor(parameters?: MeshStandardMaterialParameters);

		color: Color;
		roughness: number;
		metalness: number;
		map: Texture | null;
		lightMap: Texture | null;
		lightMapIntensity: number;
		aoMap: Texture | null;
		aoMapIntensity: number;
		emissive: Color;
		emissiveIntensity: number;
		emissiveMap: Texture | null;
		bumpMap: Texture | null;
		bumpScale: number;
		normalMap: Texture | null;
		normalMapType: NormalMapTypes;
		normalScale: Vector2;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		roughnessMap: Texture | null;
		metalnessMap: Texture | null;
		alphaMap: Texture | null;
		envMap: Texture | null;
		envMapIntensity: number;
		refractionRatio: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		skinning: boolean;
		vertexTangents: boolean;
		morphTargets: boolean;
		morphNormals: boolean;

		setValues(parameters: MeshStandardMaterialParameters): void;

	}


	export interface MeshToonMaterialParameters extends MaterialParameters {
		/** geometry color in hexadecimal. Default is 0xffffff. */
		color?: Color | string | number;
		specular?: Color | string | number;
		shininess?: number;
		opacity?: number;
		gradientMap?: Texture | null;
		map?: Texture | null;
		lightMap?: Texture | null;
		lightMapIntensity?: number;
		aoMap?: Texture | null;
		aoMapIntensity?: number;
		emissive?: Color | string | number;
		emissiveIntensity?: number;
		emissiveMap?: Texture | null;
		bumpMap?: Texture | null;
		bumpScale?: number;
		normalMap?: Texture | null;
		normalMapType?: NormalMapTypes;
		normalScale?: Vector2;
		displacementMap?: Texture | null;
		displacementScale?: number;
		displacementBias?: number;
		specularMap?: Texture | null;
		alphaMap?: Texture | null;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		wireframeLinecap?: string;
		wireframeLinejoin?: string;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
	}

	export class MeshToonMaterial extends Material {

		constructor(parameters?: MeshToonMaterialParameters);

		color: Color;
		specular: Color;
		shininess: number;
		gradientMap: Texture | null;
		map: Texture | null;
		lightMap: Texture | null;
		lightMapIntensity: number;
		aoMap: Texture | null;
		aoMapIntensity: number;
		emissive: Color;
		emissiveIntensity: number;
		emissiveMap: Texture | null;
		bumpMap: Texture | null;
		bumpScale: number;
		normalMap: Texture | null;
		normalMapType: NormalMapTypes;
		normalScale: Vector2;
		displacementMap: Texture | null;
		displacementScale: number;
		displacementBias: number;
		specularMap: Texture | null;
		alphaMap: Texture | null;
		wireframe: boolean;
		wireframeLinewidth: number;
		wireframeLinecap: string;
		wireframeLinejoin: string;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;

		setValues(parameters: MeshToonMaterialParameters): void;

	}


	export interface PointsMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		map?: Texture | null;
		alphaMap?: Texture | null;
		size?: number;
		sizeAttenuation?: boolean;
		morphTargets?: boolean;
	}

	export class PointsMaterial extends Material {

		constructor(parameters?: PointsMaterialParameters);

		color: Color;
		map: Texture | null;
		alphaMap: Texture | null;
		size: number;
		sizeAttenuation: boolean;
		morphTargets: boolean;

		setValues(parameters: PointsMaterialParameters): void;

	}


	export class RawShaderMaterial extends ShaderMaterial {

		constructor(parameters?: ShaderMaterialParameters);

	}


	/**
	 * @deprecated Use {@link PointsMaterial THREE.PointsMaterial} instead
	 */
	/**
	 * @deprecated Use {@link PointsMaterial THREE.PointsMaterial} instead
	 */
	/**
	 * @deprecated Use {@link PointsMaterial THREE.PointsMaterial} instead
	 */

	export interface ShaderMaterialParameters extends MaterialParameters {
		uniforms?: any;
		vertexShader?: string;
		fragmentShader?: string;
		linewidth?: number;
		wireframe?: boolean;
		wireframeLinewidth?: number;
		lights?: boolean;
		clipping?: boolean;
		skinning?: boolean;
		morphTargets?: boolean;
		morphNormals?: boolean;
		extensions?: {
			derivatives?: boolean;
			fragDepth?: boolean;
			drawBuffers?: boolean;
			shaderTextureLOD?: boolean;
		};
	}

	export class ShaderMaterial extends Material {

		constructor(parameters?: ShaderMaterialParameters);

		uniforms: { [uniform: string]: IUniform };
		vertexShader: string;
		fragmentShader: string;
		linewidth: number;
		wireframe: boolean;
		wireframeLinewidth: number;
		lights: boolean;
		clipping: boolean;
		skinning: boolean;
		morphTargets: boolean;
		morphNormals: boolean;
		/**
		 * @deprecated Use {@link ShaderMaterial#extensions.derivatives extensions.derivatives} instead.
		 */
		derivatives: any;
		extensions: {
			derivatives: boolean;
			fragDepth: boolean;
			drawBuffers: boolean;
			shaderTextureLOD: boolean;
		};
		defaultAttributeValues: any;
		index0AttributeName: string | undefined;
		uniformsNeedUpdate: boolean;

		setValues(parameters: ShaderMaterialParameters): void;
		toJSON(meta: any): any;

	}


	export interface ShadowMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
	}

	export class ShadowMaterial extends Material {

		constructor(parameters?: ShadowMaterialParameters);

		color: Color;

	}


	export interface SpriteMaterialParameters extends MaterialParameters {
		color?: Color | string | number;
		map?: Texture | null;
		alphaMap?: Texture | null;
		rotation?: number;
		sizeAttenuation?: boolean;
	}

	export class SpriteMaterial extends Material {

		constructor(parameters?: SpriteMaterialParameters);

		color: Color;
		map: Texture | null;
		alphaMap: Texture | null;
		rotation: number;
		sizeAttenuation: boolean;
		readonly isSpriteMaterial: true;

		setValues(parameters: SpriteMaterialParameters): void;
		copy(source: SpriteMaterial): this;

	}


	// Math //////////////////////////////////////////////////////////////////////////////////

	export class Box2 {

		constructor(min?: Vector2, max?: Vector2);

		max: Vector2;
		min: Vector2;

		set(min: Vector2, max: Vector2): Box2;
		setFromPoints(points: Vector2[]): Box2;
		setFromCenterAndSize(center: Vector2, size: Vector2): Box2;
		clone(): this;
		copy(box: Box2): this;
		makeEmpty(): Box2;
		isEmpty(): boolean;
		getCenter(target: Vector2): Vector2;
		getSize(target: Vector2): Vector2;
		expandByPoint(point: Vector2): Box2;
		expandByVector(vector: Vector2): Box2;
		expandByScalar(scalar: number): Box2;
		containsPoint(point: Vector2): boolean;
		containsBox(box: Box2): boolean;
		getParameter(point: Vector2): Vector2;
		intersectsBox(box: Box2): boolean;
		clampPoint(point: Vector2, target: Vector2): Vector2;
		distanceToPoint(point: Vector2): number;
		intersect(box: Box2): Box2;
		union(box: Box2): Box2;
		translate(offset: Vector2): Box2;
		equals(box: Box2): boolean;
		/**
		 * @deprecated Use {@link Box2#isEmpty .isEmpty()} instead.
		 */
		empty(): any;
		/**
		 * @deprecated Use {@link Box2#intersectsBox .intersectsBox()} instead.
		 */
		isIntersectionBox(b: any): any;

	}


	export class Box3 {

		constructor(min?: Vector3, max?: Vector3);

		max: Vector3;
		min: Vector3;
		readonly isBox3: true;

		set(min: Vector3, max: Vector3): this;
		setFromArray(array: ArrayLike<number>): this;
		setFromBufferAttribute(bufferAttribute: BufferAttribute): this;
		setFromPoints(points: Vector3[]): this;
		setFromCenterAndSize(center: Vector3, size: Vector3): this;
		setFromObject(object: Object3D): this;
		clone(): this;
		copy(box: Box3): this;
		makeEmpty(): this;
		isEmpty(): boolean;
		getCenter(target: Vector3): Vector3;
		getSize(target: Vector3): Vector3;
		expandByPoint(point: Vector3): this;
		expandByVector(vector: Vector3): this;
		expandByScalar(scalar: number): this;
		expandByObject(object: Object3D): this;
		containsPoint(point: Vector3): boolean;
		containsBox(box: Box3): boolean;
		getParameter(point: Vector3): Vector3;
		intersectsBox(box: Box3): boolean;
		intersectsSphere(sphere: Sphere): boolean;
		intersectsPlane(plane: Plane): boolean;
		intersectsTriangle(triangle: Triangle): boolean;
		clampPoint(point: Vector3, target: Vector3): Vector3;
		distanceToPoint(point: Vector3): number;
		getBoundingSphere(target: Sphere): Sphere;
		intersect(box: Box3): this;
		union(box: Box3): this;
		applyMatrix4(matrix: Matrix4): this;
		translate(offset: Vector3): this;
		equals(box: Box3): boolean;
		/**
		 * @deprecated Use {@link Box3#isEmpty .isEmpty()} instead.
		 */
		empty(): any;
		/**
		 * @deprecated Use {@link Box3#intersectsBox .intersectsBox()} instead.
		 */
		isIntersectionBox(b: any): any;
		/**
		 * @deprecated Use {@link Box3#intersectsSphere .intersectsSphere()} instead.
		 */
		isIntersectionSphere(s: any): any;

	}

	/**
	 * @author Joe Pea / http://github.com/trusktr
	 */

	export interface HSL {
		h: number;
		s: number;
		l: number;
	}

	/**
	 * Represents a color. See also {@link ColorUtils}.
	 *
	 * @example
	 * var color = new THREE.Color( 0xff0000 );
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
	 */
	export class Color {

		constructor(color?: Color | string | number);
		constructor(r: number, g: number, b: number);

		readonly isColor: true;

		/**
		 * Red channel value between 0 and 1. Default is 1.
		 */
		r: number;

		/**
		 * Green channel value between 0 and 1. Default is 1.
		 */
		g: number;

		/**
		 * Blue channel value between 0 and 1. Default is 1.
		 */
		b: number;

		set(color: Color): Color;
		set(color: number): Color;
		set(color: string): Color;
		setScalar(scalar: number): Color;
		setHex(hex: number): Color;

		/**
		 * Sets this color from RGB values.
		 * @param r Red channel value between 0 and 1.
		 * @param g Green channel value between 0 and 1.
		 * @param b Blue channel value between 0 and 1.
		 */
		setRGB(r: number, g: number, b: number): Color;

		/**
		 * Sets this color from HSL values.
		 * Based on MochiKit implementation by Bob Ippolito.
		 *
		 * @param h Hue channel value between 0 and 1.
		 * @param s Saturation value channel between 0 and 1.
		 * @param l Value channel value between 0 and 1.
		 */
		setHSL(h: number, s: number, l: number): Color;

		/**
		 * Sets this color from a CSS context style string.
		 * @param contextStyle Color in CSS context style format.
		 */
		setStyle(style: string): Color;

		/**
		 * Sets this color from a color name.
		 * Faster than {@link Color#setStyle .setStyle()} method if you don't need the other CSS-style formats.
		 * @param style Color name in X11 format.
		 */
		setColorName(style: string): Color;

		/**
		 * Clones this color.
		 */
		clone(): this;

		/**
		 * Copies given color.
		 * @param color Color to copy.
		 */
		copy(color: Color): this;

		/**
		 * Copies given color making conversion from gamma to linear space.
		 * @param color Color to copy.
		 */
		copyGammaToLinear(color: Color, gammaFactor?: number): Color;

		/**
		 * Copies given color making conversion from linear to gamma space.
		 * @param color Color to copy.
		 */
		copyLinearToGamma(color: Color, gammaFactor?: number): Color;

		/**
		 * Converts this color from gamma to linear space.
		 */
		convertGammaToLinear(gammaFactor?: number): Color;

		/**
		 * Converts this color from linear to gamma space.
		 */
		convertLinearToGamma(gammaFactor?: number): Color;

		/**
		 * Copies given color making conversion from sRGB to linear space.
		 * @param color Color to copy.
		 */
		copySRGBToLinear(color: Color): Color;

		/**
		 * Copies given color making conversion from linear to sRGB space.
		 * @param color Color to copy.
		 */
		copyLinearToSRGB(color: Color): Color;

		/**
		 * Converts this color from sRGB to linear space.
		 */
		convertSRGBToLinear(): Color;

		/**
		 * Converts this color from linear to sRGB space.
		 */
		convertLinearToSRGB(): Color;

		/**
		 * Returns the hexadecimal value of this color.
		 */
		getHex(): number;

		/**
		 * Returns the string formated hexadecimal value of this color.
		 */
		getHexString(): string;

		getHSL(target: HSL): HSL;

		/**
		 * Returns the value of this color in CSS context style.
		 * Example: rgb(r, g, b)
		 */
		getStyle(): string;

		offsetHSL(h: number, s: number, l: number): this;

		add(color: Color): this;
		addColors(color1: Color, color2: Color): this;
		addScalar(s: number): this;
		sub(color: Color): this;
		multiply(color: Color): this;
		multiplyScalar(s: number): this;
		lerp(color: Color, alpha: number): this;
		lerpHSL(color: Color, alpha: number): this;
		equals(color: Color): boolean;

		/**
		 * Sets this color's red, green and blue value from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets this color's red, green and blue value from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array [red, green, blue], or copies red, green and blue into the provided array.
		 * @param array (optional) array to store the color to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies red, green and blue into the provided array-like.
		 * @param array array-like to store the color to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(xyz: ArrayLike<number>, offset?: number): ArrayLike<number>;

		/**
		 * List of X11 color names.
		 */
		static NAMES: Record<string, number>;

	}


	export class Cylindrical {

		constructor(radius?: number, theta?: number, y?: number);

		radius: number;
		theta: number;
		y: number;

		clone(): this;
		copy(other: Cylindrical): this;
		set(radius: number, theta: number, y: number): this;
		setFromVector3(vec3: Vector3): this;
		setFromCartesianCoords(x: number, y: number, z: number): this;

	}


	export class Euler {

		constructor(x?: number, y?: number, z?: number, order?: string);

		x: number;
		y: number;
		z: number;
		order: string;
		readonly isEuler: true;

		_onChangeCallback: Function;

		set(x: number, y: number, z: number, order?: string): Euler;
		clone(): this;
		copy(euler: Euler): this;
		setFromRotationMatrix(m: Matrix4, order?: string): Euler;
		setFromQuaternion(q: Quaternion, order?: string): Euler;
		setFromVector3(v: Vector3, order?: string): Euler;
		reorder(newOrder: string): Euler;
		equals(euler: Euler): boolean;
		fromArray(xyzo: any[]): Euler;
		toArray(array?: number[], offset?: number): number[];
		toVector3(optionalResult?: Vector3): Vector3;
		_onChange(callback: Function): this;

		static RotationOrders: string[];
		static DefaultOrder: string;

	}


	/**
	 * Frustums are used to determine what is inside the camera's field of view. They help speed up the rendering process.
	 */
	export class Frustum {

		constructor(
			p0?: Plane,
			p1?: Plane,
			p2?: Plane,
			p3?: Plane,
			p4?: Plane,
			p5?: Plane
		);

		/**
		 * Array of 6 vectors.
		 */
		planes: Plane[];

		set(
			p0: Plane,
			p1: Plane,
			p2: Plane,
			p3: Plane,
			p4: Plane,
			p5: Plane
		): Frustum;
		clone(): this;
		copy(frustum: Frustum): this;
		setFromProjectionMatrix(m: Matrix4): this;
		intersectsObject(object: Object3D): boolean;
		intersectsSprite(sprite: Sprite): boolean;
		intersectsSphere(sphere: Sphere): boolean;
		intersectsBox(box: Box3): boolean;
		containsPoint(point: Vector3): boolean;

	}

	export abstract class Interpolant {

		constructor(
			parameterPositions: any,
			sampleValues: any,
			sampleSize: number,
			resultBuffer?: any
		);

		parameterPositions: any;
		sampleValues: any;
		valueSize: number;
		resultBuffer: any;

		evaluate(time: number): any;

	}


	export class CubicInterpolant extends Interpolant {

		constructor(
			parameterPositions: any,
			samplesValues: any,
			sampleSize: number,
			resultBuffer?: any
		);

		interpolate_(i1: number, t0: number, t: number, t1: number): any;

	}


	export class DiscreteInterpolant extends Interpolant {

		constructor(
			parameterPositions: any,
			samplesValues: any,
			sampleSize: number,
			resultBuffer?: any
		);

		interpolate_(i1: number, t0: number, t: number, t1: number): any;

	}


	export class LinearInterpolant extends Interpolant {

		constructor(
			parameterPositions: any,
			samplesValues: any,
			sampleSize: number,
			resultBuffer?: any
		);

		interpolate_(i1: number, t0: number, t: number, t1: number): any;

	}


	export class QuaternionLinearInterpolant extends Interpolant {

		constructor(
			parameterPositions: any,
			samplesValues: any,
			sampleSize: number,
			resultBuffer?: any
		);

		interpolate_(i1: number, t0: number, t: number, t1: number): any;

	}


	export class Line3 {

		constructor(start?: Vector3, end?: Vector3);

		start: Vector3;
		end: Vector3;

		set(start?: Vector3, end?: Vector3): Line3;
		clone(): this;
		copy(line: Line3): this;
		getCenter(target: Vector3): Vector3;
		delta(target: Vector3): Vector3;
		distanceSq(): number;
		distance(): number;
		at(t: number, target: Vector3): Vector3;
		closestPointToPointParameter(point: Vector3, clampToLine?: boolean): number;
		closestPointToPoint(
			point: Vector3,
			clampToLine: boolean,
			target: Vector3
		): Vector3;
		applyMatrix4(matrix: Matrix4): Line3;
		equals(line: Line3): boolean;

	}


	/**
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Math.js">src/math/Math.js</a>
	 */
	export namespace MathUtils {
		export const DEG2RAD: number;
		export const RAD2DEG: number;

		export function generateUUID(): string;

		/**
		 * Clamps the x to be between a and b.
		 *
		 * @param value Value to be clamped.
		 * @param min Minimum value
		 * @param max Maximum value.
		 */
		export function clamp(value: number, min: number, max: number): number;
		export function euclideanModulo(n: number, m: number): number;

		/**
		 * Linear mapping of x from range [a1, a2] to range [b1, b2].
		 *
		 * @param x Value to be mapped.
		 * @param a1 Minimum value for range A.
		 * @param a2 Maximum value for range A.
		 * @param b1 Minimum value for range B.
		 * @param b2 Maximum value for range B.
		 */
		export function mapLinear(
			x: number,
			a1: number,
			a2: number,
			b1: number,
			b2: number
		): number;

		export function smoothstep(x: number, min: number, max: number): number;

		export function smootherstep(x: number, min: number, max: number): number;

		/**
		 * Random float from 0 to 1 with 16 bits of randomness.
		 * Standard Math.random() creates repetitive patterns when applied over larger space.
		 *
		 * @deprecated Use {@link Math#random Math.random()}
		 */
		export function random16(): number;

		/**
		 * Random integer from low to high interval.
		 */
		export function randInt(low: number, high: number): number;

		/**
		 * Random float from low to high interval.
		 */
		export function randFloat(low: number, high: number): number;

		/**
		 * Random float from - range / 2 to range / 2 interval.
		 */
		export function randFloatSpread(range: number): number;

		export function degToRad(degrees: number): number;

		export function radToDeg(radians: number): number;

		export function isPowerOfTwo(value: number): boolean;

		/**
		 * Returns a value linearly interpolated from two known points based
		 * on the given interval - t = 0 will return x and t = 1 will return y.
		 *
		 * @param x Start point.
		 * @param y End point.
		 * @param t interpolation factor in the closed interval [0, 1]
		 * @return {number}
		 */
		export function lerp(x: number, y: number, t: number): number;

		/**
		 * @deprecated Use {@link Math#floorPowerOfTwo .floorPowerOfTwo()}
		 */
		export function nearestPowerOfTwo(value: number): number;

		/**
		 * @deprecated Use {@link Math#ceilPowerOfTwo .ceilPowerOfTwo()}
		 */
		export function nextPowerOfTwo(value: number): number;

		export function floorPowerOfTwo(value: number): number;

		export function ceilPowerOfTwo(value: number): number;

		export function setQuaternionFromProperEuler(q: Quaternion, a: number, b: number, c: number, order: string): void;
	}


	/**
	 * ( interface Matrix&lt;T&gt; )
	 */
	export interface Matrix {
		/**
		 * Array with matrix values.
		 */
		elements: number[];

		/**
		 * identity():T;
		 */
		identity(): Matrix;

		/**
		 * copy(m:T):T;
		 */
		copy(m: this): this;

		/**
		 * multiplyScalar(s:number):T;
		 */
		multiplyScalar(s: number): Matrix;

		determinant(): number;

		/**
		 * getInverse(matrix:T):T;
		 */
		getInverse(matrix: Matrix): Matrix;

		/**
		 * transpose():T;
		 */
		transpose(): Matrix;

		/**
		 * clone():T;
		 */
		clone(): this;
	}

	/**
	 * ( class Matrix3 implements Matrix&lt;Matrix3&gt; )
	 */
	export class Matrix3 implements Matrix {

		/**
		 * Creates an identity matrix.
		 */
		constructor();

		/**
		 * Array with matrix values.
		 */
		elements: number[];

		set(
			n11: number,
			n12: number,
			n13: number,
			n21: number,
			n22: number,
			n23: number,
			n31: number,
			n32: number,
			n33: number
		): Matrix3;
		identity(): Matrix3;
		clone(): this;
		copy(m: Matrix3): this;
		extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix3;
		setFromMatrix4(m: Matrix4): Matrix3;
		multiplyScalar(s: number): Matrix3;
		determinant(): number;
		getInverse(matrix: Matrix3, throwOnDegenerate?: boolean): Matrix3;

		/**
		 * Transposes this matrix in place.
		 */
		transpose(): Matrix3;
		getNormalMatrix(matrix4: Matrix4): Matrix3;

		/**
		 * Transposes this matrix into the supplied array r, and returns itself.
		 */
		transposeIntoArray(r: number[]): Matrix3;

		setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): Matrix3;

		scale(sx: number, sy: number): Matrix3;

		rotate(theta: number): Matrix3;

		translate(tx: number, ty: number): Matrix3;

		equals(matrix: Matrix3): boolean;

		/**
		 * Sets the values of this matrix from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): Matrix3;

		/**
		 * Sets the values of this matrix from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): Matrix3;

		/**
		 * Returns an array with the values of this matrix, or copies them into the provided array.
		 * @param array (optional) array to store the matrix to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies he values of this matrix into the provided array-like.
		 * @param array array-like to store the matrix to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;

		/**
		 * Multiplies this matrix by m.
		 */
		multiply(m: Matrix3): Matrix3;

		premultiply(m: Matrix3): Matrix3;

		/**
		 * Sets this matrix to a x b.
		 */
		multiplyMatrices(a: Matrix3, b: Matrix3): Matrix3;

		/**
		 * @deprecated Use {@link Vector3.applyMatrix3 vector.applyMatrix3( matrix )} instead.
		 */
		multiplyVector3(vector: Vector3): any;

		/**
		 * @deprecated This method has been removed completely.
		 */
		multiplyVector3Array(a: any): any;
		getInverse(matrix: Matrix4, throwOnDegenerate?: boolean): Matrix3;

		/**
		 * @deprecated Use {@link Matrix3#toArray .toArray()} instead.
		 */
		flattenToArrayOffset(array: number[], offset: number): number[];

	}

	/**
	 * A 4x4 Matrix.
	 *
	 * @example
	 * // Simple rig for rotating around 3 axes
	 * var m = new THREE.Matrix4();
	 * var m1 = new THREE.Matrix4();
	 * var m2 = new THREE.Matrix4();
	 * var m3 = new THREE.Matrix4();
	 * var alpha = 0;
	 * var beta = Math.PI;
	 * var gamma = Math.PI/2;
	 * m1.makeRotationX( alpha );
	 * m2.makeRotationY( beta );
	 * m3.makeRotationZ( gamma );
	 * m.multiplyMatrices( m1, m2 );
	 * m.multiply( m3 );
	 */
	export class Matrix4 implements Matrix {

		constructor();

		/**
		 * Array with matrix values.
		 */
		elements: number[];

		/**
		 * Sets all fields of this matrix.
		 */
		set(
			n11: number,
			n12: number,
			n13: number,
			n14: number,
			n21: number,
			n22: number,
			n23: number,
			n24: number,
			n31: number,
			n32: number,
			n33: number,
			n34: number,
			n41: number,
			n42: number,
			n43: number,
			n44: number
		): Matrix4;

		/**
		 * Resets this matrix to identity.
		 */
		identity(): Matrix4;
		clone(): this;
		copy(m: Matrix4): this;
		copyPosition(m: Matrix4): Matrix4;
		extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix4;
		makeBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix4;

		/**
		 * Copies the rotation component of the supplied matrix m into this matrix rotation component.
		 */
		extractRotation(m: Matrix4): Matrix4;
		makeRotationFromEuler(euler: Euler): Matrix4;
		makeRotationFromQuaternion(q: Quaternion): Matrix4;
		/**
		 * Constructs a rotation matrix, looking from eye towards center with defined up vector.
		 */
		lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4;

		/**
		 * Multiplies this matrix by m.
		 */
		multiply(m: Matrix4): Matrix4;

		premultiply(m: Matrix4): Matrix4;

		/**
		 * Sets this matrix to a x b.
		 */
		multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4;

		/**
		 * Sets this matrix to a x b and stores the result into the flat array r.
		 * r can be either a regular Array or a TypedArray.
		 *
		 * @deprecated This method has been removed completely.
		 */
		multiplyToArray(a: Matrix4, b: Matrix4, r: number[]): Matrix4;

		/**
		 * Multiplies this matrix by s.
		 */
		multiplyScalar(s: number): Matrix4;

		/**
		 * Computes determinant of this matrix.
		 * Based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 */
		determinant(): number;

		/**
		 * Transposes this matrix.
		 */
		transpose(): Matrix4;

		/**
		 * Sets the position component for this matrix from vector v.
		 */
		setPosition(v: Vector3 | number, y?: number, z?: number): Matrix4;

		/**
		 * Sets this matrix to the inverse of matrix m.
		 * Based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm.
		 */
		getInverse(m: Matrix4): Matrix4;

		/**
		 * Multiplies the columns of this matrix by vector v.
		 */
		scale(v: Vector3): Matrix4;

		getMaxScaleOnAxis(): number;
		/**
		 * Sets this matrix as translation transform.
		 */
		makeTranslation(x: number, y: number, z: number): Matrix4;

		/**
		 * Sets this matrix as rotation transform around x axis by theta radians.
		 *
		 * @param theta Rotation angle in radians.
		 */
		makeRotationX(theta: number): Matrix4;

		/**
		 * Sets this matrix as rotation transform around y axis by theta radians.
		 *
		 * @param theta Rotation angle in radians.
		 */
		makeRotationY(theta: number): Matrix4;

		/**
		 * Sets this matrix as rotation transform around z axis by theta radians.
		 *
		 * @param theta Rotation angle in radians.
		 */
		makeRotationZ(theta: number): Matrix4;

		/**
		 * Sets this matrix as rotation transform around axis by angle radians.
		 * Based on http://www.gamedev.net/reference/articles/article1199.asp.
		 *
		 * @param axis Rotation axis.
		 * @param theta Rotation angle in radians.
		 */
		makeRotationAxis(axis: Vector3, angle: number): Matrix4;

		/**
		 * Sets this matrix as scale transform.
		 */
		makeScale(x: number, y: number, z: number): Matrix4;

		/**
		 * Sets this matrix to the transformation composed of translation, rotation and scale.
		 */
		compose(translation: Vector3, rotation: Quaternion, scale: Vector3): Matrix4;

		/**
		 * Decomposes this matrix into it's position, quaternion and scale components.
		 */
		decompose(
			translation: Vector3,
			rotation: Quaternion,
			scale: Vector3
		): Matrix4;

		/**
		 * Creates a frustum matrix.
		 */
		makePerspective(
			left: number,
			right: number,
			bottom: number,
			top: number,
			near: number,
			far: number
		): Matrix4;

		/**
		 * Creates a perspective projection matrix.
		 */
		makePerspective(
			fov: number,
			aspect: number,
			near: number,
			far: number
		): Matrix4;

		/**
		 * Creates an orthographic projection matrix.
		 */
		makeOrthographic(
			left: number,
			right: number,
			top: number,
			bottom: number,
			near: number,
			far: number
		): Matrix4;
		equals(matrix: Matrix4): boolean;

		/**
		 * Sets the values of this matrix from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): Matrix4;

		/**
		 * Sets the values of this matrix from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): Matrix4;

		/**
		 * Returns an array with the values of this matrix, or copies them into the provided array.
		 * @param array (optional) array to store the matrix to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies he values of this matrix into the provided array-like.
		 * @param array array-like to store the matrix to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;

		/**
		 * @deprecated Use {@link Matrix4#copyPosition .copyPosition()} instead.
		 */
		extractPosition(m: Matrix4): Matrix4;

		/**
		 * @deprecated Use {@link Matrix4#makeRotationFromQuaternion .makeRotationFromQuaternion()} instead.
		 */
		setRotationFromQuaternion(q: Quaternion): Matrix4;

		/**
		 * @deprecated Use {@link Vector3#applyMatrix4 vector.applyMatrix4( matrix )} instead.
		 */
		multiplyVector3(v: any): any;

		/**
		 * @deprecated Use {@link Vector4#applyMatrix4 vector.applyMatrix4( matrix )} instead.
		 */
		multiplyVector4(v: any): any;

		/**
		 * @deprecated This method has been removed completely.
		 */
		multiplyVector3Array(array: number[]): number[];

		/**
		 * @deprecated Use {@link Vector3#transformDirection Vector3.transformDirection( matrix )} instead.
		 */
		rotateAxis(v: any): void;

		/**
		 * @deprecated Use {@link Vector3#applyMatrix4 vector.applyMatrix4( matrix )} instead.
		 */
		crossVector(v: any): void;

		/**
		 * @deprecated Use {@link Matrix4#toArray .toArray()} instead.
		 */
		flattenToArrayOffset(array: number[], offset: number): number[];

	}


	export class Plane {

		constructor(normal?: Vector3, constant?: number);

		normal: Vector3;
		constant: number;
		readonly isPlane: true;

		set(normal: Vector3, constant: number): Plane;
		setComponents(x: number, y: number, z: number, w: number): Plane;
		setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
		setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
		clone(): this;
		copy(plane: Plane): this;
		normalize(): Plane;
		negate(): Plane;
		distanceToPoint(point: Vector3): number;
		distanceToSphere(sphere: Sphere): number;
		projectPoint(point: Vector3, target: Vector3): Vector3;
		orthoPoint(point: Vector3, target: Vector3): Vector3;
		intersectLine(line: Line3, target: Vector3): Vector3 | undefined;
		intersectsLine(line: Line3): boolean;
		intersectsBox(box: Box3): boolean;
		intersectsSphere(sphere: Sphere): boolean;
		coplanarPoint(target: Vector3): Vector3;
		applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): Plane;
		translate(offset: Vector3): Plane;
		equals(plane: Plane): boolean;

		/**
		 * @deprecated Use {@link Plane#intersectsLine .intersectsLine()} instead.
		 */
		isIntersectionLine(l: any): any;

	}


	/**
	 * Implementation of a quaternion. This is used for rotating things without incurring in the dreaded gimbal lock issue, amongst other advantages.
	 *
	 * @example
	 * var quaternion = new THREE.Quaternion();
	 * quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
	 * var vector = new THREE.Vector3( 1, 0, 0 );
	 * vector.applyQuaternion( quaternion );
	 */
	export class Quaternion {

		/**
		 * @param x x coordinate
		 * @param y y coordinate
		 * @param z z coordinate
		 * @param w w coordinate
		 */
		constructor(x?: number, y?: number, z?: number, w?: number);

		x: number;
		y: number;
		z: number;
		w: number;
		readonly isQuaternion: true;

		/**
		 * Sets values of this quaternion.
		 */
		set(x: number, y: number, z: number, w: number): Quaternion;

		/**
		 * Clones this quaternion.
		 */
		clone(): this;

		/**
		 * Copies values of q to this quaternion.
		 */
		copy(q: Quaternion): this;

		/**
		 * Sets this quaternion from rotation specified by Euler angles.
		 */
		setFromEuler(euler: Euler): Quaternion;

		/**
		 * Sets this quaternion from rotation specified by axis and angle.
		 * Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm.
		 * Axis have to be normalized, angle is in radians.
		 */
		setFromAxisAngle(axis: Vector3, angle: number): Quaternion;

		/**
		 * Sets this quaternion from rotation component of m. Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm.
		 */
		setFromRotationMatrix(m: Matrix4): Quaternion;
		setFromUnitVectors(vFrom: Vector3, vTo: Vector3): Quaternion;
		angleTo(q: Quaternion): number;
		rotateTowards(q: Quaternion, step: number): Quaternion;

		/**
		 * Inverts this quaternion.
		 */
		inverse(): Quaternion;

		conjugate(): Quaternion;
		dot(v: Quaternion): number;
		lengthSq(): number;

		/**
		 * Computes length of this quaternion.
		 */
		length(): number;

		/**
		 * Normalizes this quaternion.
		 */
		normalize(): Quaternion;

		/**
		 * Multiplies this quaternion by b.
		 */
		multiply(q: Quaternion): Quaternion;
		premultiply(q: Quaternion): Quaternion;

		/**
		 * Sets this quaternion to a x b
		 * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm.
		 */
		multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;

		slerp(qb: Quaternion, t: number): Quaternion;
		equals(v: Quaternion): boolean;

		/**
		 * Sets this quaternion's x, y, z and w value from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets this quaternion's x, y, z and w value from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array [x, y, z, w], or copies x, y, z and w into the provided array.
		 * @param array (optional) array to store the quaternion to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies x, y, z and w into the provided array-like.
		 * @param array array-like to store the quaternion to.
		 * @param offset (optional) optional offset into the array.
		 * @return The provided array-like.
		 */
		toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

		_onChange(callback: Function): Quaternion;
		_onChangeCallback: Function;

		/**
		 * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/.
		 */
		static slerp(
			qa: Quaternion,
			qb: Quaternion,
			qm: Quaternion,
			t: number
		): Quaternion;

		static slerpFlat(
			dst: number[],
			dstOffset: number,
			src0: number[],
			srcOffset: number,
			src1: number[],
			stcOffset1: number,
			t: number
		): Quaternion;

		static multiplyQuaternionsFlat(
			dst: number[],
			dstOffset: number,
			src0: number[],
			srcOffset: number,
			src1: number[],
			stcOffset1: number
		): number[];

		/**
		 * @deprecated Use {@link Vector#applyQuaternion vector.applyQuaternion( quaternion )} instead.
		 */
		multiplyVector3(v: any): any;

	}


	export class Ray {

		constructor(origin?: Vector3, direction?: Vector3);

		origin: Vector3;
		direction: Vector3;

		set(origin: Vector3, direction: Vector3): Ray;
		clone(): this;
		copy(ray: Ray): this;
		at(t: number, target: Vector3): Vector3;
		lookAt(v: Vector3): Ray;
		recast(t: number): Ray;
		closestPointToPoint(point: Vector3, target: Vector3): Vector3;
		distanceToPoint(point: Vector3): number;
		distanceSqToPoint(point: Vector3): number;
		distanceSqToSegment(
			v0: Vector3,
			v1: Vector3,
			optionalPointOnRay?: Vector3,
			optionalPointOnSegment?: Vector3
		): number;
		intersectSphere(sphere: Sphere, target: Vector3): Vector3 | null;
		intersectsSphere(sphere: Sphere): boolean;
		distanceToPlane(plane: Plane): number;
		intersectPlane(plane: Plane, target: Vector3): Vector3 | null;
		intersectsPlane(plane: Plane): boolean;
		intersectBox(box: Box3, target: Vector3): Vector3 | null;
		intersectsBox(box: Box3): boolean;
		intersectTriangle(
			a: Vector3,
			b: Vector3,
			c: Vector3,
			backfaceCulling: boolean,
			target: Vector3
		): Vector3 | null;
		applyMatrix4(matrix4: Matrix4): Ray;
		equals(ray: Ray): boolean;

		/**
		 * @deprecated Use {@link Ray#intersectsBox .intersectsBox()} instead.
		 */
		isIntersectionBox(b: any): any;

		/**
		 * @deprecated Use {@link Ray#intersectsPlane .intersectsPlane()} instead.
		 */
		isIntersectionPlane(p: any): any;

		/**
		 * @deprecated Use {@link Ray#intersectsSphere .intersectsSphere()} instead.
		 */
		isIntersectionSphere(s: any): any;

	}


	export class Sphere {

		constructor(center?: Vector3, radius?: number);

		center: Vector3;
		radius: number;

		set(center: Vector3, radius: number): Sphere;
		setFromPoints(points: Vector3[], optionalCenter?: Vector3): Sphere;
		clone(): this;
		copy(sphere: Sphere): this;
		isEmpty(): boolean;
		makeEmpty(): this;
		containsPoint(point: Vector3): boolean;
		distanceToPoint(point: Vector3): number;
		intersectsSphere(sphere: Sphere): boolean;
		intersectsBox(box: Box3): boolean;
		intersectsPlane(plane: Plane): boolean;
		clampPoint(point: Vector3, target: Vector3): Vector3;
		getBoundingBox(target: Box3): Box3;
		applyMatrix4(matrix: Matrix4): Sphere;
		translate(offset: Vector3): Sphere;
		equals(sphere: Sphere): boolean;

		/**
		 * @deprecated Use {@link Sphere#isEmpty .isEmpty()} instead.
		 */
		empty(): any;

	}


	export class Spherical {

		constructor(radius?: number, phi?: number, theta?: number);

		radius: number;
		phi: number;
		theta: number;

		set(radius: number, phi: number, theta: number): this;
		clone(): this;
		copy(other: Spherical): this;
		makeSafe(): this;
		setFromVector3(v: Vector3): this;
		setFromCartesianCoords(x: number, y: number, z: number): this;

	}


	export class SphericalHarmonics3 {

		constructor();

		coefficients: Vector3[];
		readonly isSphericalHarmonics3: true;

		set(coefficients: Vector3[]): SphericalHarmonics3;
		zero(): SphericalHarmonics3;
		add(sh: SphericalHarmonics3): SphericalHarmonics3;
		addScaledSH(sh: SphericalHarmonics3, s: number): SphericalHarmonics3;
		scale(s: number): SphericalHarmonics3;
		lerp(sh: SphericalHarmonics3, alpha: number): SphericalHarmonics3;
		equals(sh: SphericalHarmonics3): boolean;
		copy(sh: SphericalHarmonics3): SphericalHarmonics3;
		clone(): SphericalHarmonics3;

		/**
		 * Sets the values of this spherical harmonics from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets the values of this spherical harmonics from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array with the values of this spherical harmonics, or copies them into the provided array.
		 * @param array (optional) array to store the spherical harmonics to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Returns an array with the values of this spherical harmonics, or copies them into the provided array-like.
		 * @param array array-like to store the spherical harmonics to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

		getAt(normal: Vector3, target: Vector3): Vector3;
		getIrradianceAt(normal: Vector3, target: Vector3): Vector3;

		static getBasisAt(normal: Vector3, shBasis: number[]): void;

	}


	export interface SplineControlPoint {
		x: number;
		y: number;
		z: number;
	}

	export class Triangle {

		constructor(a?: Vector3, b?: Vector3, c?: Vector3);

		a: Vector3;
		b: Vector3;
		c: Vector3;

		set(a: Vector3, b: Vector3, c: Vector3): Triangle;
		setFromPointsAndIndices(
			points: Vector3[],
			i0: number,
			i1: number,
			i2: number
		): Triangle;
		clone(): this;
		copy(triangle: Triangle): this;
		getArea(): number;
		getMidpoint(target: Vector3): Vector3;
		getNormal(target: Vector3): Vector3;
		getPlane(target: Plane): Plane;
		getBarycoord(point: Vector3, target: Vector3): Vector3;
		getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, target: Vector2): Vector2;
		containsPoint(point: Vector3): boolean;
		intersectsBox(box: Box3): boolean;
		isFrontFacing(direction: Vector3): boolean;
		closestPointToPoint(point: Vector3, target: Vector3): Vector3;
		equals(triangle: Triangle): boolean;

		static getNormal(
			a: Vector3,
			b: Vector3,
			c: Vector3,
			target: Vector3
		): Vector3;
		static getBarycoord(
			point: Vector3,
			a: Vector3,
			b: Vector3,
			c: Vector3,
			target: Vector3
		): Vector3;
		static containsPoint(
			point: Vector3,
			a: Vector3,
			b: Vector3,
			c: Vector3
		): boolean;
		static getUV(
			point: Vector3,
			p1: Vector3,
			p2: Vector3,
			p3: Vector3,
			uv1: Vector2,
			uv2: Vector2,
			uv3: Vector2,
			target: Vector2
		): Vector2;
		static isFrontFacing(
			a: Vector3,
			b: Vector3,
			c: Vector3,
			direction: Vector3
		): boolean;

	}


	/**
	 * ( interface Vector&lt;T&gt; )
	 *
	 * Abstract interface of Vector2, Vector3 and Vector4.
	 * Currently the members of Vector is NOT type safe because it accepts different typed vectors.
	 * Those definitions will be changed when TypeScript innovates Generics to be type safe.
	 *
	 * @example
	 * var v:THREE.Vector = new THREE.Vector3();
	 * v.addVectors(new THREE.Vector2(0, 1), new THREE.Vector2(2, 3));		// invalid but compiled successfully
	 */
	export interface Vector {
		setComponent(index: number, value: number): this;

		getComponent(index: number): number;

		set(...args: number[]): this;

		setScalar(scalar: number): this;

		/**
		 * copy(v:T):T;
		 */
		copy(v: Vector): this;

		/**
		 * NOTE: The second argument is deprecated.
		 *
		 * add(v:T):T;
		 */
		add(v: Vector, w?: Vector): this;

		/**
		 * addVectors(a:T, b:T):T;
		 */
		addVectors(a: Vector, b: Vector): this;

		addScaledVector(vector: Vector, scale: number): this;

		/**
		 * Adds the scalar value s to this vector's values.
		 */
		addScalar(scalar: number): this;

		/**
		 * sub(v:T):T;
		 */
		sub(v: Vector): this;

		/**
		 * subVectors(a:T, b:T):T;
		 */
		subVectors(a: Vector, b: Vector): this;

		/**
		 * multiplyScalar(s:number):T;
		 */
		multiplyScalar(s: number): this;

		/**
		 * divideScalar(s:number):T;
		 */
		divideScalar(s: number): this;

		/**
		 * negate():T;
		 */
		negate(): this;

		/**
		 * dot(v:T):T;
		 */
		dot(v: Vector): number;

		/**
		 * lengthSq():number;
		 */
		lengthSq(): number;

		/**
		 * length():number;
		 */
		length(): number;

		/**
		 * normalize():T;
		 */
		normalize(): this;

		/**
		 * NOTE: Vector4 doesn't have the property.
		 *
		 * distanceTo(v:T):number;
		 */
		distanceTo?(v: Vector): number;

		/**
		 * NOTE: Vector4 doesn't have the property.
		 *
		 * distanceToSquared(v:T):number;
		 */
		distanceToSquared?(v: Vector): number;

		/**
		 * setLength(l:number):T;
		 */
		setLength(l: number): this;

		/**
		 * lerp(v:T, alpha:number):T;
		 */
		lerp(v: Vector, alpha: number): this;

		/**
		 * equals(v:T):boolean;
		 */
		equals(v: Vector): boolean;

		/**
		 * clone():T;
		 */
		clone(): this;
	}

	/**
	 * 2D vector.
	 *
	 * ( class Vector2 implements Vector<Vector2> )
	 */
	export class Vector2 implements Vector {

		constructor(x?: number, y?: number);

		x: number;
		y: number;
		width: number;
		height: number;
		readonly isVector2: true;

		/**
		 * Sets value of this vector.
		 */
		set(x: number, y: number): this;

		/**
		 * Sets the x and y values of this vector both equal to scalar.
		 */
		setScalar(scalar: number): this;

		/**
		 * Sets X component of this vector.
		 */
		setX(x: number): this;

		/**
		 * Sets Y component of this vector.
		 */
		setY(y: number): this;

		/**
		 * Sets a component of this vector.
		 */
		setComponent(index: number, value: number): this;

		/**
		 * Gets a component of this vector.
		 */
		getComponent(index: number): number;

		/**
		 * Returns a new Vector2 instance with the same `x` and `y` values.
		 */
		clone(): this;

		/**
		 * Copies value of v to this vector.
		 */
		copy(v: Vector2): this;

		/**
		 * Adds v to this vector.
		 */
		add(v: Vector2, w?: Vector2): this;

		/**
		 * Adds the scalar value s to this vector's x and y values.
		 */
		addScalar(s: number): this;

		/**
		 * Sets this vector to a + b.
		 */
		addVectors(a: Vector2, b: Vector2): this;

		/**
		 * Adds the multiple of v and s to this vector.
		 */
		addScaledVector(v: Vector2, s: number): this;

		/**
		 * Subtracts v from this vector.
		 */
		sub(v: Vector2): this;

		/**
		 * Subtracts s from this vector's x and y components.
		 */
		subScalar(s: number): this;

		/**
		 * Sets this vector to a - b.
		 */
		subVectors(a: Vector2, b: Vector2): this;

		/**
		 * Multiplies this vector by v.
		 */
		multiply(v: Vector2): this;

		/**
		 * Multiplies this vector by scalar s.
		 */
		multiplyScalar(scalar: number): this;

		/**
		 * Divides this vector by v.
		 */
		divide(v: Vector2): this;

		/**
		 * Divides this vector by scalar s.
		 * Set vector to ( 0, 0 ) if s == 0.
		 */
		divideScalar(s: number): this;

		/**
		 * Multiplies this vector (with an implicit 1 as the 3rd component) by m.
		 */
		applyMatrix3(m: Matrix3): this;

		/**
		 * If this vector's x or y value is greater than v's x or y value, replace that value with the corresponding min value.
		 */
		min(v: Vector2): this;

		/**
		 * If this vector's x or y value is less than v's x or y value, replace that value with the corresponding max value.
		 */
		max(v: Vector2): this;

		/**
		 * If this vector's x or y value is greater than the max vector's x or y value, it is replaced by the corresponding value.
		 * If this vector's x or y value is less than the min vector's x or y value, it is replaced by the corresponding value.
		 * @param min the minimum x and y values.
		 * @param max the maximum x and y values in the desired range.
		 */
		clamp(min: Vector2, max: Vector2): this;

		/**
		 * If this vector's x or y values are greater than the max value, they are replaced by the max value.
		 * If this vector's x or y values are less than the min value, they are replaced by the min value.
		 * @param min the minimum value the components will be clamped to.
		 * @param max the maximum value the components will be clamped to.
		 */
		clampScalar(min: number, max: number): this;

		/**
		 * If this vector's length is greater than the max value, it is replaced by the max value.
		 * If this vector's length is less than the min value, it is replaced by the min value.
		 * @param min the minimum value the length will be clamped to.
		 * @param max the maximum value the length will be clamped to.
		 */
		clampLength(min: number, max: number): this;

		/**
		 * The components of the vector are rounded down to the nearest integer value.
		 */
		floor(): this;

		/**
		 * The x and y components of the vector are rounded up to the nearest integer value.
		 */
		ceil(): this;

		/**
		 * The components of the vector are rounded to the nearest integer value.
		 */
		round(): this;

		/**
		 * The components of the vector are rounded towards zero (up if negative, down if positive) to an integer value.
		 */
		roundToZero(): this;

		/**
		 * Inverts this vector.
		 */
		negate(): this;

		/**
		 * Computes dot product of this vector and v.
		 */
		dot(v: Vector2): number;

		/**
		 * Computes cross product of this vector and v.
		 */
		cross(v: Vector2): number;

		/**
		 * Computes squared length of this vector.
		 */
		lengthSq(): number;

		/**
		 * Computes length of this vector.
		 */
		length(): number;

		/**
		 * @deprecated Use {@link Vector2#manhattanLength .manhattanLength()} instead.
		 */
		lengthManhattan(): number;

		/**
		 * Computes the Manhattan length of this vector.
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanLength(): number;

		/**
		 * Normalizes this vector.
		 */
		normalize(): this;

		/**
		 * computes the angle in radians with respect to the positive x-axis
		 */
		angle(): number;

		/**
		 * Computes distance of this vector to v.
		 */
		distanceTo(v: Vector2): number;

		/**
		 * Computes squared distance of this vector to v.
		 */
		distanceToSquared(v: Vector2): number;

		/**
		 * @deprecated Use {@link Vector2#manhattanDistanceTo .manhattanDistanceTo()} instead.
		 */
		distanceToManhattan(v: Vector2): number;

		/**
		 * Computes the Manhattan length (distance) from this vector to the given vector v
		 *
		 * @param {Vector2} v
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanDistanceTo(v: Vector2): number;

		/**
		 * Normalizes this vector and multiplies it by l.
		 */
		setLength(length: number): this;

		/**
		 * Linearly interpolates between this vector and v, where alpha is the distance along the line - alpha = 0 will be this vector, and alpha = 1 will be v.
		 * @param v vector to interpolate towards.
		 * @param alpha interpolation factor in the closed interval [0, 1].
		 */
		lerp(v: Vector2, alpha: number): this;

		/**
		 * Sets this vector to be the vector linearly interpolated between v1 and v2 where alpha is the distance along the line connecting the two vectors - alpha = 0 will be v1, and alpha = 1 will be v2.
		 * @param v1 the starting vector.
		 * @param v2 vector to interpolate towards.
		 * @param alpha interpolation factor in the closed interval [0, 1].
		 */
		lerpVectors(v1: Vector2, v2: Vector2, alpha: number): this;

		/**
		 * Checks for strict equality of this vector and v.
		 */
		equals(v: Vector2): boolean;

		/**
		 * Sets this vector's x and y value from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets this vector's x and y value from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array [x, y], or copies x and y into the provided array.
		 * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies x and y into the provided array-like.
		 * @param array array-like to store the vector to.
		 * @param offset (optional) optional offset into the array.
		 * @return The provided array-like.
		 */
		toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

		/**
		 * Sets this vector's x and y values from the attribute.
		 * @param attribute the source attribute.
		 * @param index index in the attribute.
		 */
		fromBufferAttribute(attribute: BufferAttribute, index: number): this;

		/**
		 * Rotates the vector around center by angle radians.
		 * @param center the point around which to rotate.
		 * @param angle the angle to rotate, in radians.
		 */
		rotateAround(center: Vector2, angle: number): this;

		/**
		 * Computes the Manhattan length of this vector.
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanLength(): number;

		/**
		 * Computes the Manhattan length (distance) from this vector to the given vector v
		 *
		 * @param {Vector2} v
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanDistanceTo(v: Vector2): number;

		/**
		 * Sets this vector's x and y from Math.random
		 */
		random(): this;

	}

	/**
	 * 3D vector.
	 *
	 * @example
	 * var a = new THREE.Vector3( 1, 0, 0 );
	 * var b = new THREE.Vector3( 0, 1, 0 );
	 * var c = new THREE.Vector3();
	 * c.crossVectors( a, b );
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js">src/math/Vector3.js</a>
	 *
	 * ( class Vector3 implements Vector<Vector3> )
	 */
	export class Vector3 implements Vector {

		constructor(x?: number, y?: number, z?: number);

		x: number;
		y: number;
		z: number;
		readonly isVector3: true;

		/**
		 * Sets value of this vector.
		 */
		set(x: number, y: number, z: number): this;

		/**
		 * Sets all values of this vector.
		 */
		setScalar(scalar: number): this;

		/**
		 * Sets x value of this vector.
		 */
		setX(x: number): Vector3;

		/**
		 * Sets y value of this vector.
		 */
		setY(y: number): Vector3;

		/**
		 * Sets z value of this vector.
		 */
		setZ(z: number): Vector3;

		setComponent(index: number, value: number): this;

		getComponent(index: number): number;

		/**
		 * Clones this vector.
		 */
		clone(): this;

		/**
		 * Copies value of v to this vector.
		 */
		copy(v: Vector3): this;

		/**
		 * Adds v to this vector.
		 */
		add(v: Vector3, w?: Vector3): this;

		addScalar(s: number): this;

		addScaledVector(v: Vector3, s: number): this;

		/**
		 * Sets this vector to a + b.
		 */
		addVectors(a: Vector3, b: Vector3): this;

		/**
		 * Subtracts v from this vector.
		 */
		sub(a: Vector3): this;

		subScalar(s: number): this;

		/**
		 * Sets this vector to a - b.
		 */
		subVectors(a: Vector3, b: Vector3): this;

		multiply(v: Vector3): this;

		/**
		 * Multiplies this vector by scalar s.
		 */
		multiplyScalar(s: number): this;

		multiplyVectors(a: Vector3, b: Vector3): this;

		applyEuler(euler: Euler): this;

		applyAxisAngle(axis: Vector3, angle: number): this;

		applyMatrix3(m: Matrix3): this;

		applyNormalMatrix(m: Matrix3): this;

		applyMatrix4(m: Matrix4): this;

		applyQuaternion(q: Quaternion): this;

		project(camera: Camera): this;

		unproject(camera: Camera): this;

		transformDirection(m: Matrix4): this;

		divide(v: Vector3): this;

		/**
		 * Divides this vector by scalar s.
		 * Set vector to ( 0, 0, 0 ) if s == 0.
		 */
		divideScalar(s: number): this;

		min(v: Vector3): this;

		max(v: Vector3): this;

		clamp(min: Vector3, max: Vector3): this;

		clampScalar(min: number, max: number): this;

		clampLength(min: number, max: number): this;

		floor(): this;

		ceil(): this;

		round(): this;

		roundToZero(): this;

		/**
		 * Inverts this vector.
		 */
		negate(): this;

		/**
		 * Computes dot product of this vector and v.
		 */
		dot(v: Vector3): number;

		/**
		 * Computes squared length of this vector.
		 */
		lengthSq(): number;

		/**
		 * Computes length of this vector.
		 */
		length(): number;

		/**
		 * Computes Manhattan length of this vector.
		 * http://en.wikipedia.org/wiki/Taxicab_geometry
		 *
		 * @deprecated Use {@link Vector3#manhattanLength .manhattanLength()} instead.
		 */
		lengthManhattan(): number;

		/**
		 * Computes the Manhattan length of this vector.
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanLength(): number;

		/**
		 * Computes the Manhattan length (distance) from this vector to the given vector v
		 *
		 * @param {Vector3} v
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanDistanceTo(v: Vector3): number;

		/**
		 * Normalizes this vector.
		 */
		normalize(): this;

		/**
		 * Normalizes this vector and multiplies it by l.
		 */
		setLength(l: number): this;
		lerp(v: Vector3, alpha: number): this;

		lerpVectors(v1: Vector3, v2: Vector3, alpha: number): this;

		/**
		 * Sets this vector to cross product of itself and v.
		 */
		cross(a: Vector3, w?: Vector3): this;

		/**
		 * Sets this vector to cross product of a and b.
		 */
		crossVectors(a: Vector3, b: Vector3): this;
		projectOnVector(v: Vector3): this;
		projectOnPlane(planeNormal: Vector3): this;
		reflect(vector: Vector3): this;
		angleTo(v: Vector3): number;

		/**
		 * Computes distance of this vector to v.
		 */
		distanceTo(v: Vector3): number;

		/**
		 * Computes squared distance of this vector to v.
		 */
		distanceToSquared(v: Vector3): number;

		/**
		 * @deprecated Use {@link Vector3#manhattanDistanceTo .manhattanDistanceTo()} instead.
		 */
		distanceToManhattan(v: Vector3): number;

		setFromSpherical(s: Spherical): this;
		setFromSphericalCoords(r: number, phi: number, theta: number): this;
		setFromCylindrical(s: Cylindrical): this;
		setFromCylindricalCoords(radius: number, theta: number, y: number): this;
		setFromMatrixPosition(m: Matrix4): this;
		setFromMatrixScale(m: Matrix4): this;
		setFromMatrixColumn(matrix: Matrix4, index: number): this;
		setFromMatrix3Column(matrix: Matrix3, index: number): this;

		/**
		 * Checks for strict equality of this vector and v.
		 */
		equals(v: Vector3): boolean;

		/**
		 * Sets this vector's x, y and z value from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets this vector's x, y and z value from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array [x, y, z], or copies x, y and z into the provided array.
		 * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies x, y and z into the provided array-like.
		 * @param array array-like to store the vector to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

		fromBufferAttribute(
			attribute: BufferAttribute,
			index: number,
			offset?: number
		): this;

		/**
		 * Sets this vector's x, y and z from Math.random
		 */
		random(): this;

	}


	/**
	 * 4D vector.
	 *
	 * ( class Vector4 implements Vector<Vector4> )
	 */
	export class Vector4 implements Vector {

		constructor(x?: number, y?: number, z?: number, w?: number);

		x: number;
		y: number;
		z: number;
		w: number;
		width: number;
		height: number;
		readonly isVector4: true;

		/**
		 * Sets value of this vector.
		 */
		set(x: number, y: number, z: number, w: number): this;

		/**
		 * Sets all values of this vector.
		 */
		setScalar(scalar: number): this;

		/**
		 * Sets X component of this vector.
		 */
		setX(x: number): this;

		/**
		 * Sets Y component of this vector.
		 */
		setY(y: number): this;

		/**
		 * Sets Z component of this vector.
		 */
		setZ(z: number): this;

		/**
		 * Sets w component of this vector.
		 */
		setW(w: number): this;

		setComponent(index: number, value: number): this;

		getComponent(index: number): number;

		/**
		 * Clones this vector.
		 */
		clone(): this;

		/**
		 * Copies value of v to this vector.
		 */
		copy(v: Vector4): this;

		/**
		 * Adds v to this vector.
		 */
		add(v: Vector4, w?: Vector4): this;

		addScalar(scalar: number): this;

		/**
		 * Sets this vector to a + b.
		 */
		addVectors(a: Vector4, b: Vector4): this;

		addScaledVector(v: Vector4, s: number): this;
		/**
		 * Subtracts v from this vector.
		 */
		sub(v: Vector4): this;

		subScalar(s: number): this;

		/**
		 * Sets this vector to a - b.
		 */
		subVectors(a: Vector4, b: Vector4): this;

		/**
		 * Multiplies this vector by scalar s.
		 */
		multiplyScalar(s: number): this;

		applyMatrix4(m: Matrix4): this;

		/**
		 * Divides this vector by scalar s.
		 * Set vector to ( 0, 0, 0 ) if s == 0.
		 */
		divideScalar(s: number): this;

		/**
		 * http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
		 * @param q is assumed to be normalized
		 */
		setAxisAngleFromQuaternion(q: Quaternion): this;

		/**
		 * http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
		 * @param m assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
		 */
		setAxisAngleFromRotationMatrix(m: Matrix3): this;

		min(v: Vector4): this;
		max(v: Vector4): this;
		clamp(min: Vector4, max: Vector4): this;
		clampScalar(min: number, max: number): this;
		floor(): this;
		ceil(): this;
		round(): this;
		roundToZero(): this;

		/**
		 * Inverts this vector.
		 */
		negate(): this;

		/**
		 * Computes dot product of this vector and v.
		 */
		dot(v: Vector4): number;

		/**
		 * Computes squared length of this vector.
		 */
		lengthSq(): number;

		/**
		 * Computes length of this vector.
		 */
		length(): number;

		/**
		 * Computes the Manhattan length of this vector.
		 *
		 * @return {number}
		 *
		 * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
		 */
		manhattanLength(): number;

		/**
		 * Normalizes this vector.
		 */
		normalize(): this;
		/**
		 * Normalizes this vector and multiplies it by l.
		 */
		setLength(length: number): this;

		/**
		 * Linearly interpolate between this vector and v with alpha factor.
		 */
		lerp(v: Vector4, alpha: number): this;

		lerpVectors(v1: Vector4, v2: Vector4, alpha: number): this;

		/**
		 * Checks for strict equality of this vector and v.
		 */
		equals(v: Vector4): boolean;

		/**
		 * Sets this vector's x, y, z and w value from the provided array.
		 * @param array the source array.
		 * @param offset (optional) offset into the array. Default is 0.
		 */
		fromArray(array: number[], offset?: number): this;

		/**
		 * Sets this vector's x, y, z and w value from the provided array-like.
		 * @param array the source array-like.
		 * @param offset (optional) offset into the array-like. Default is 0.
		 */
		fromArray(array: ArrayLike<number>, offset?: number): this;

		/**
		 * Returns an array [x, y, z, w], or copies x, y, z and w into the provided array.
		 * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
		 * @param offset (optional) optional offset into the array.
		 * @return The created or provided array.
		 */
		toArray(array?: number[], offset?: number): number[];

		/**
		 * Copies x, y, z and w into the provided array-like.
		 * @param array array-like to store the vector to.
		 * @param offset (optional) optional offset into the array-like.
		 * @return The provided array-like.
		 */
		toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

		fromBufferAttribute(
			attribute: BufferAttribute,
			index: number,
			offset?: number
		): this;

		/**
		 * Sets this vector's x, y, z and w from Math.random
		 */
		random(): this;

	}


	// Objects //////////////////////////////////////////////////////////////////////////////////

	export class Bone extends Object3D {

		constructor();
		readonly isBone: true;
		type: 'Bone';

	}


	export class Group extends Object3D {

		constructor();
		type: 'Group';
		readonly isGroup: true;

	}


	export class InstancedMesh extends Mesh {

		constructor(
			geometry: Geometry | BufferGeometry,
			material: Material | Material[],
			count: number
		);

		count: number;
		instanceMatrix: BufferAttribute;
		readonly isInstancedMesh: true;

		getMatrixAt(index: number, matrix: Matrix4): void;
		setMatrixAt(index: number, matrix: Matrix4): void;



	}


	export class Line extends Object3D {

		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[],
			mode?: number
		);

		geometry: Geometry | BufferGeometry;
		material: Material | Material[];

		type: 'Line' | 'LineLoop' | 'LineSegments';
		readonly isLine: true;

		computeLineDistances(): this;
		raycast(raycaster: Raycaster, intersects: Intersection[]): void;

	}


	export class LineLoop extends Line {

		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[]
		);

		type: 'LineLoop';
		readonly isLineLoop: true;

	}


	/**
	 * @deprecated
	 */
	export const LineStrip: number;
	/**
	 * @deprecated
	 */
	export const LinePieces: number;

	export class LineSegments extends Line {

		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[],
			mode?: number
		);

		type: 'LineSegments';
		readonly isLineSegments: true;

	}


	export class LOD extends Object3D {

		constructor();

		type: 'LOD';

		levels: { distance: number; object: Object3D }[];
		autoUpdate: boolean;
		readonly isLOD: true;

		addLevel(object: Object3D, distance?: number): this;
		getCurrentLevel(): number;
		getObjectForDistance(distance: number): Object3D | null;
		raycast(raycaster: Raycaster, intersects: Intersection[]): void;
		update(camera: Camera): void;
		toJSON(meta: any): any;

		/**
		 * @deprecated Use {@link LOD#levels .levels} instead.
		 */
		objects: any[];

	}


	export class Mesh extends Object3D {

		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[]
		);

		geometry: Geometry | BufferGeometry;
		material: Material | Material[];
		morphTargetInfluences?: number[];
		morphTargetDictionary?: { [key: string]: number };
		readonly isMesh: true;
		type: string;

		updateMorphTargets(): void;
		raycast(raycaster: Raycaster, intersects: Intersection[]): void;

	}


	/**
	 * A class for displaying particles in the form of variable size points. For example, if using the WebGLRenderer, the particles are displayed using GL_POINTS.
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/objects/ParticleSystem.js">src/objects/ParticleSystem.js</a>
	 */
	export class Points extends Object3D {

		/**
		 * @param geometry An instance of Geometry or BufferGeometry.
		 * @param material An instance of Material (optional).
		 */
		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[]
		);

		type: 'Points';
		morphTargetInfluences?: number[];
		morphTargetDictionary?: { [key: string]: number };
		readonly isPoints: true;

		/**
		 * An instance of Geometry or BufferGeometry, where each vertex designates the position of a particle in the system.
		 */
		geometry: Geometry | BufferGeometry;

		/**
		 * An instance of Material, defining the object's appearance. Default is a PointsMaterial with randomised colour.
		 */
		material: Material | Material[];

		raycast(raycaster: Raycaster, intersects: Intersection[]): void;
		updateMorphTargets(): void;

	}


	export class Skeleton {

		constructor(bones: Bone[], boneInverses?: Matrix4[]);

		/**
		 * @deprecated This property has been removed completely.
		 */
		useVertexTexture: boolean;
		bones: Bone[];
		boneMatrices: Float32Array;
		boneTexture: undefined | DataTexture;
		boneInverses: Matrix4[];

		calculateInverses(bone: Bone): void;
		pose(): void;
		update(): void;
		clone(): Skeleton;
		getBoneByName(name: string): undefined | Bone;

		dispose(): void;

	}


	export class SkinnedMesh extends Mesh {

		constructor(
			geometry?: Geometry | BufferGeometry,
			material?: Material | Material[],
			useVertexTexture?: boolean
		);

		bindMode: string;
		bindMatrix: Matrix4;
		bindMatrixInverse: Matrix4;
		skeleton: Skeleton;
		readonly isSkinnedMesh: true;

		bind(skeleton: Skeleton, bindMatrix?: Matrix4): void;
		pose(): void;
		normalizeSkinWeights(): void;
		updateMatrixWorld(force?: boolean): void;

	}


	export class Sprite extends Object3D {

		constructor(material?: SpriteMaterial);

		type: 'Sprite';
		readonly isSprite: true;

		geometry: BufferGeometry;
		material: SpriteMaterial;
		center: Vector2;

		raycast(raycaster: Raycaster, intersects: Intersection[]): void;
		copy(source: this): this;

	}

	// log handlers
	export function warn(message?: any, ...optionalParams: any[]): void;
	export function error(message?: any, ...optionalParams: any[]): void;
	export function log(message?: any, ...optionalParams: any[]): void;

	// typed array parameters
	export type TypedArray =
		Int8Array
		| Uint8Array
		| Uint8ClampedArray
		| Int16Array
		| Uint16Array
		| Int32Array
		| Uint32Array
		| Float32Array
		| Float64Array;

	// Renderers / Shaders /////////////////////////////////////////////////////////////////////
	export let ShaderChunk: {
		[name: string]: string;

		alphamap_fragment: string;
		alphamap_pars_fragment: string;
		alphatest_fragment: string;
		aomap_fragment: string;
		aomap_pars_fragment: string;
		begin_vertex: string;
		beginnormal_vertex: string;
		bsdfs: string;
		bumpmap_pars_fragment: string;
		clipping_planes_fragment: string;
		clipping_planes_pars_fragment: string;
		clipping_planes_pars_vertex: string;
		clipping_planes_vertex: string;
		color_fragment: string;
		color_pars_fragment: string;
		color_pars_vertex: string;
		color_vertex: string;
		common: string;
		cube_frag: string;
		cube_vert: string;
		cube_uv_reflection_fragment: string;
		defaultnormal_vertex: string;
		depth_frag: string;
		depth_vert: string;
		distanceRGBA_frag: string;
		distanceRGBA_vert: string;
		displacementmap_vertex: string;
		displacementmap_pars_vertex: string;
		emissivemap_fragment: string;
		emissivemap_pars_fragment: string;
		encodings_pars_fragment: string;
		encodings_fragment: string;
		envmap_fragment: string;
		envmap_common_pars_fragment: string
		envmap_pars_fragment: string;
		envmap_pars_vertex: string;
		envmap_vertex: string;
		equirect_frag: string;
		equirect_vert: string;
		fog_fragment: string;
		fog_pars_fragment: string;
		linedashed_frag: string;
		linedashed_vert: string;
		lightmap_fragment: string;
		lightmap_pars_fragment: string;
		lights_lambert_vertex: string;
		lights_pars_begin: string;
		envmap_physical_pars_fragment: string;
		lights_pars_map: string;
		lights_phong_fragment: string;
		lights_phong_pars_fragment: string;
		lights_physical_fragment: string;
		lights_physical_pars_fragment: string;
		lights_fragment_begin: string;
		lights_fragment_maps: string;
		lights_fragment_end: string;
		logdepthbuf_fragment: string;
		logdepthbuf_pars_fragment: string;
		logdepthbuf_pars_vertex: string;
		logdepthbuf_vertex: string;
		map_fragment: string;
		map_pars_fragment: string;
		map_particle_fragment: string;
		map_particle_pars_fragment: string;
		meshbasic_frag: string;
		meshbasic_vert: string;
		meshlambert_frag: string;
		meshlambert_vert: string;
		meshphong_frag: string;
		meshphong_vert: string;
		meshphysical_frag: string;
		meshphysical_vert: string;
		metalnessmap_fragment: string;
		metalnessmap_pars_fragment: string;
		morphnormal_vertex: string;
		morphtarget_pars_vertex: string;
		morphtarget_vertex: string;
		normal_flip: string;
		normal_frag: string;
		normal_fragment_begin: string;
		normal_fragment_maps: string;
		normal_vert: string;
		normalmap_pars_fragment: string;
		clearcoat_normal_fragment_begin: string;
		clearcoat_normal_fragment_maps: string;
		clearcoat_pars_fragment: string;
		packing: string;
		points_frag: string;
		points_vert: string;
		shadow_frag: string;
		shadow_vert: string;

		premultiplied_alpha_fragment: string;
		project_vertex: string;
		roughnessmap_fragment: string;
		roughnessmap_pars_fragment: string;
		shadowmap_pars_fragment: string;
		shadowmap_pars_vertex: string;
		shadowmap_vertex: string;
		shadowmask_pars_fragment: string;
		skinbase_vertex: string;
		skinning_pars_vertex: string;
		skinning_vertex: string;
		skinnormal_vertex: string;
		specularmap_fragment: string;
		specularmap_pars_fragment: string;
		tonemapping_fragment: string;
		tonemapping_pars_fragment: string;
		uv2_pars_fragment: string;
		uv2_pars_vertex: string;
		uv2_vertex: string;
		uv_pars_fragment: string;
		uv_pars_vertex: string;
		uv_vertex: string;
		worldpos_vertex: string;
	};


	export interface Shader {
		uniforms: { [uniform: string]: IUniform };
		vertexShader: string;
		fragmentShader: string;
	}

	export let ShaderLib: {
		[name: string]: Shader;
		basic: Shader;
		lambert: Shader;
		phong: Shader;
		standard: Shader;
		matcap: Shader;
		points: Shader;
		dashed: Shader;
		depth: Shader;
		normal: Shader;
		sprite: Shader;
		background: Shader;
		cube: Shader;
		equirect: Shader;
		distanceRGBA: Shader;
		shadow: Shader;
		physical: Shader;
	};

	export interface IUniform {
		value: any;
	}

	export let UniformsLib: {
		common: {
			diffuse: IUniform;
			opacity: IUniform;
			map: IUniform;
			uvTransform: IUniform;
			uv2Transform: IUniform;
			alphaMap: IUniform;
		};
		specularmap: {
			specularMap: IUniform;
		};
		envmap: {
			envMap: IUniform;
			flipEnvMap: IUniform;
			reflectivity: IUniform;
			refractionRatio: IUniform;
			maxMipLevel: IUniform;
		};
		aomap: {
			aoMap: IUniform;
			aoMapIntensity: IUniform;
		};
		lightmap: {
			lightMap: IUniform;
			lightMapIntensity: IUniform;
		};
		emissivemap: {
			emissiveMap: IUniform;
		};
		bumpmap: {
			bumpMap: IUniform;
			bumpScale: IUniform;
		};
		normalmap: {
			normalMap: IUniform;
			normalScale: IUniform;
		};
		displacementmap: {
			displacementMap: IUniform;
			displacementScale: IUniform;
			displacementBias: IUniform;
		};
		roughnessmap: {
			roughnessMap: IUniform;
		};
		metalnessmap: {
			metalnessMap: IUniform;
		};
		gradientmap: {
			gradientMap: IUniform;
		};
		fog: {
			fogDensity: IUniform;
			fogNear: IUniform;
			fogFar: IUniform;
			fogColor: IUniform;
		};
		lights: {
			ambientLightColor: IUniform;
			directionalLights: {
				value: any[];
				properties: {
					direction: {};
					color: {};
				};
			};
			directionalLightShadows: {
				value: any[];
				properties: {
					shadowBias: {};
					shadowRadius: {};
					shadowMapSize: {};
				};
			};
			directionalShadowMap: IUniform;
			directionalShadowMatrix: IUniform;
			spotLights: {
				value: any[];
				properties: {
					color: {};
					position: {};
					direction: {};
					distance: {};
					coneCos: {};
					penumbraCos: {};
					decay: {};
				};
			};
			spotLightShadows: {
				value: any[];
				properties: {
					shadowBias: {};
					shadowRadius: {};
					shadowMapSize: {};
				};
			};
			spotShadowMap: IUniform;
			spotShadowMatrix: IUniform;
			pointLights: {
				value: any[];
				properties: {
					color: {};
					position: {};
					decay: {};
					distance: {};
				};
			};
			pointLightShadows: {
				value: any[];
				properties: {
					shadowBias: {};
					shadowRadius: {};
					shadowMapSize: {};
				};
			};
			pointShadowMap: IUniform;
			pointShadowMatrix: IUniform;
			hemisphereLights: {
				value: any[];
				properties: {
					direction: {};
					skycolor: {};
					groundColor: {};
				};
			};
			rectAreaLights: {
				value: any[];
				properties: {
					color: {};
					position: {};
					width: {};
					height: {};
				};
			};
		};
		points: {
			diffuse: IUniform;
			opacity: IUniform;
			size: IUniform;
			scale: IUniform;
			map: IUniform;
			uvTransform: IUniform;
		};
	};

	export function cloneUniforms(uniforms_src: any): any;
	export function mergeUniforms(uniforms: any[]): any;

	export namespace UniformsUtils {
		export function merge(uniforms: any[]): any;
		export function clone(uniforms_src: any): any;
	}

	export class WebGLAnimation {

		start(): void;

		stop(): void;

		setAnimationLoop(callback: Function): void;

		//setContext(value: WebGLRenderingContext | WebGL2RenderingContext): void;
		setContext(value: WebGLRenderingContext): void;
	}


	export class WebGLAttributes {

		constructor(gl: WebGLRenderingContext, capabilities: WebGLCapabilities);
		//constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, capabilities: WebGLCapabilities);
		get(attribute: BufferAttribute | InterleavedBufferAttribute): {
			buffer: WebGLBuffer,
			type: GLenum,
			bytesPerElement: number,
			version: number
		};

		remove(attribute: BufferAttribute | InterleavedBufferAttribute): void;

		update(attribute: BufferAttribute | InterleavedBufferAttribute, bufferType: GLenum): void;

	}


	export class WebGLBackground {

		constructor(renderer: WebGLRenderer, state: WebGLState, objects: WebGLObjects, premultipliedAlpha: any);

		getClearColor(): void;
		setClearColor(color: Color, alpha: any): void;
		getClearAlpha(): void;
		setClearAlpha(alpha: any): void;
		render(renderList: WebGLRenderLists, scene: Scene, camera: any, forceClear: any): void;

	}

	// Renderers / WebGL /////////////////////////////////////////////////////////////////////
	export class WebGLBufferRenderer {

		constructor(_gl: WebGLRenderingContext, extensions: any, _infoRender: any);

		setMode(value: any): void;
		render(start: any, count: number): void;
		renderInstances(geometry: any): void;

	}

	export interface WebGLCapabilitiesParameters {
		precision?: string;
		logarithmicDepthBuffer?: boolean;
	}

	export class WebGLCapabilities {

		constructor(
			gl: WebGLRenderingContext,
			extensions: any,
			parameters: WebGLCapabilitiesParameters
		);

		readonly isWebGL2: true;
		precision: string;
		logarithmicDepthBuffer: boolean;
		maxTextures: number;
		maxVertexTextures: number;
		maxTextureSize: number;
		maxCubemapSize: number;
		maxAttributes: number;
		maxVertexUniforms: number;
		maxVaryings: number;
		maxFragmentUniforms: number;
		vertexTextures: boolean;
		floatFragmentTextures: boolean;
		floatVertexTextures: boolean;

		getMaxAnisotropy(): number;
		getMaxPrecision(precision: string): string;

	}


	export class WebGLClipping {

		uniform: { value: any; needsUpdate: boolean };
		numPlanes: number;

		init(planes: any[], enableLocalClipping: boolean, camera: Camera): boolean;
		beginShadows(): void;
		endShadows(): void;
		setState(
			planes: any[],
			clipShadows: boolean,
			camera: Camera,
			cache: boolean,
			fromCache: boolean
		): void;

	}

	export class WebGLExtensions {

		constructor(gl: WebGLRenderingContext);

		get(name: string): any;

	}


	export class WebGLGeometries {

		constructor(gl: WebGLRenderingContext, attributes: WebGLAttributes, info: WebGLInfo);

		get(object: Object3D, geometry: Geometry | BufferGeometry): BufferGeometry;
		update(geometry: Geometry | BufferGeometry): void;
		getWireframeAttribute(geometry: Geometry | BufferGeometry): BufferAttribute;

	}

	export class WebGLIndexedBufferRenderer {

		constructor(
			gl: WebGLRenderingContext,
			extensions: any,
			info: any,
			capabilities: any
		);

		setMode(value: any): void;
		setIndex(index: any): void;
		render(start: any, count: number): void;
		renderInstances(
			geometry: any,
			start: any,
			count: number,
			primcount: number
		): void;

	}


	/**
	 * An object with a series of statistical information about the graphics board memory and the rendering process.
	 */
	export class WebGLInfo {

		constructor(gl: WebGLRenderingContext);

		autoReset: boolean;
		memory: {
			geometries: number;
			textures: number;
		};
		programs: WebGLProgram[] | null;
		render: {
			calls: number;
			frame: number;
			lines: number;
			points: number;
			triangles: number;
		};
		update(count: number, mode: GLenum, instanceCount: number): void;
		reset(): void;

	}

	export class WebGLLights {

		constructor(gl: WebGLRenderingContext, properties: any, info: any);

		state: {
			version: number;

			hash: {
				directionalLength: number;
				pointLength: number;
				spotLength: number;
				rectAreaLength: number;
				hemiLength: number;

				numDirectionalShadows: number;
				numPointShadows: number;
				numSpotShadows: number;
			};

			ambient: Array<number>;
			probe: Array<any>;
			directional: Array<any>;
			directionalShadow: Array<any>;
			directionalShadowMap: Array<any>;
			directionalShadowMatrix: Array<any>;
			spot: Array<any>;
			spotShadow: Array<any>;
			spotShadowMap: Array<any>;
			spotShadowMatrix: Array<any>;
			rectArea: Array<any>;
			point: Array<any>;
			pointShadow: Array<any>;
			pointShadowMap: Array<any>;
			pointShadowMatrix: Array<any>;
			hemi: Array<any>;
		};

		get(light: any): any;
		setup(lights: any, shadows: any, camera: any): void;

	}


	export class WebGLMorphtargets {

		constructor(gl: WebGLRenderingContext);

		update(object: Object3D, geometry: BufferGeometry, material: Material, program: WebGLProgram): void;

	}

	export class WebGLObjects {

		constructor(
			gl: WebGLRenderingContext,
			geometries: any,
			attributes: any,
			info: any
		);

		update(object: any): any;
		dispose(): void;

	}


	export class WebGLProgram {

		constructor(
			renderer: WebGLRenderer,
			cacheKey: string,
			parameters: any
		);

		name: string;
		id: number;
		cacheKey: string; // unique identifier for this program, used for looking up compiled programs from cache.
		usedTimes: number;
		program: any;
		vertexShader: WebGLShader;
		fragmentShader: WebGLShader;
		/**
		 * @deprecated Use {@link WebGLProgram#getUniforms getUniforms()} instead.
		 */
		uniforms: any;
		/**
		 * @deprecated Use {@link WebGLProgram#getAttributes getAttributes()} instead.
		 */
		attributes: any;

		getUniforms(): WebGLUniforms;
		getAttributes(): any;
		destroy(): void;

	}


	export class WebGLPrograms {

		constructor(renderer: WebGLRenderer, extensions: WebGLExtensions, capabilities: WebGLCapabilities);

		programs: WebGLProgram[];

		getParameters(
			material: Material,
			lights: any[],
			shadows: any[],
			scene: Scene,
			nClipPlanes: number,
			nClipIntersection: number,
			object: any
		): any;
		getProgramCacheKey(parameters: any): string;
		acquireProgram(
			parameters: any,
			cacheKey: string
		): WebGLProgram;
		releaseProgram(program: WebGLProgram): void;

	}

	export class WebGLProperties {

		constructor();

		get(object: any): any;
		remove(object: any): void;
		update(object: any, key: any, value: any): any;
		dispose(): void;

	}


	export interface RenderTarget { } // not defined in the code, used in LightShadow and WebGRenderer classes

	export interface RenderItem {
		id: number;
		object: Object3D;
		geometry: BufferGeometry | null;
		material: Material;
		program: WebGLProgram;
		groupOrder: number;
		renderOrder: number;
		z: number;
		group: Group | null;
	}

	export class WebGLRenderList {

		opaque: Array<RenderItem>;
		transparent: Array<RenderItem>;
		init(): void;
		push(
			object: Object3D,
			geometry: BufferGeometry | null,
			material: Material,
			groupOrder: number,
			z: number,
			group: Group | null
		): void;
		unshift(
			object: Object3D,
			geometry: BufferGeometry | null,
			material: Material,
			groupOrder: number,
			z: number,
			group: Group | null
		): void;
		sort(): void;

	}

	export class WebGLRenderLists {

		dispose(): void;
		get(scene: Scene, camera: Camera): WebGLRenderList;

	}


	interface WebGLRenderState {

		init(): void;
		state: {
			lightsArray: Light[];
			shadowsArray: Light[];
			lights: WebGLLights;
		};
		setupLights(camera: Camera): void;
		pushLight(light: Light): void;
		pushShadow(shadowLight: Light): void;

	}

	export class WebGLRenderStates {

		get(scene: Scene, camera: Camera): WebGLRenderState;
		dispose(): void;

	}

	export class WebGLShader {

		constructor(gl: WebGLRenderingContext, type: string, string: string);

	}


	export class WebGLShadowMap {

		constructor(
			_renderer: WebGLRenderer,
			_objects: any[],
			maxTextureSize: number
		);

		enabled: boolean;
		autoUpdate: boolean;
		needsUpdate: boolean;
		type: ShadowMapType;

		render(scene: Scene, camera: Camera): void;

		/**
		 * @deprecated Use {@link WebGLShadowMap#renderReverseSided .shadowMap.renderReverseSided} instead.
		 */
		cullFace: any;

	}


	export class WebGLColorBuffer {

		constructor();

		setMask(colorMask: boolean): void;
		setLocked(lock: boolean): void;
		setClear(r: number, g: number, b: number, a: number, premultipliedAlpha: boolean): void;
		reset(): void;

	}

	export class WebGLDepthBuffer {

		constructor();

		setTest(depthTest: boolean): void;
		setMask(depthMask: boolean): void;
		setFunc(depthFunc: DepthModes): void;
		setLocked(lock: boolean): void;
		setClear(depth: number): void;
		reset(): void;

	}

	export class WebGLStencilBuffer {

		constructor();

		setTest(stencilTest: boolean): void;
		setMask(stencilMask: number): void;
		setFunc(stencilFunc: number, stencilRef: number, stencilMask: number): void;
		setOp(stencilFail: number, stencilZFail: number, stencilZPass: number): void;
		setLocked(lock: boolean): void;
		setClear(stencil: number): void;
		reset(): void;

	}

	export class WebGLState {

		constructor(gl: WebGLRenderingContext, extensions: WebGLExtensions, capabilities: WebGLCapabilities);

		buffers: {
			color: WebGLColorBuffer;
			depth: WebGLDepthBuffer;
			stencil: WebGLStencilBuffer;
		};

		initAttributes(): void;
		enableAttribute(attribute: number): void;
		enableAttributeAndDivisor(attribute: number, meshPerAttribute: number): void;
		disableUnusedAttributes(): void;
		vertexAttribPointer(index: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
		enable(id: number): void;
		disable(id: number): void;
		useProgram(program: any): boolean;
		setBlending(
			blending: Blending,
			blendEquation?: BlendingEquation,
			blendSrc?: BlendingSrcFactor,
			blendDst?: BlendingDstFactor,
			blendEquationAlpha?: BlendingEquation,
			blendSrcAlpha?: BlendingSrcFactor,
			blendDstAlpha?: BlendingDstFactor,
			premultiplyAlpha?: boolean
		): void;
		setMaterial(material: Material, frontFaceCW: boolean): void;
		setFlipSided(flipSided: boolean): void;
		setCullFace(cullFace: CullFace): void;
		setLineWidth(width: number): void;
		setPolygonOffset(polygonoffset: boolean, factor: number, units: number): void;
		setScissorTest(scissorTest: boolean): void;
		activeTexture(webglSlot: number): void;
		bindTexture(webglType: number, webglTexture: any): void;
		unbindTexture(): void;
		// Same interface as https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		compressedTexImage2D(
			target: number,
			level: number,
			internalformat: number,
			width: number,
			height: number,
			border: number,
			data: ArrayBufferView
		): void;
		// Same interface as https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
		texImage2D(
			target: number,
			level: number,
			internalformat: number,
			width: number,
			height: number,
			border: number,
			format: number,
			type: number,
			pixels: ArrayBufferView | null
		): void;
		texImage2D(
			target: number,
			level: number,
			internalformat: number,
			format: number,
			type: number,
			source: any
		): void;
		texImage3D(
			target: number,
			level: number,
			internalformat: number,
			width: number,
			height: number,
			depth: number,
			border: number,
			format: number,
			type: number,
			pixels: any
		): void;
		scissor(scissor: Vector4): void;
		viewport(viewport: Vector4): void;
		reset(): void;

	}


	export class WebGLTextures {

		constructor(
			gl: WebGLRenderingContext,
			extensions: WebGLExtensions,
			state: WebGLState,
			properties: WebGLProperties,
			capabilities: WebGLCapabilities,
			utils: WebGLUtils,
			info: WebGLInfo
		);

		allocateTextureUnit(): void;
		resetTextureUnits(): void;
		setTexture2D(texture: any, slot: number): void;
		setTexture2DArray(texture: any, slot: number): void;
		setTexture3D(texture: any, slot: number): void;
		setTextureCube(texture: any, slot: number): void;
		setTextureCubeDynamic(texture: any, slot: number): void;
		setupRenderTarget(renderTarget: any): void;
		updateRenderTargetMipmap(renderTarget: any): void;
		updateMultisampleRenderTarget(renderTarget: any): void;
		safeSetTexture2D(texture: any, slot: number): void;
		safeSetTextureCube(texture: any, slot: number): void;

	}


	export class WebGLUniforms {

		constructor(gl: WebGLRenderingContext, program: WebGLProgram);

		setValue(gl: WebGLRenderingContext, name: string, value: any, textures: WebGLTextures): void;
		setOptional(gl: WebGLRenderingContext, object: any, name: string): void;

		static upload(gl: WebGLRenderingContext, seq: any, values: any[], textures: WebGLTextures): void;
		static seqWithValue(seq: any, values: any[]): any[];

	}

	export class WebGLUtils {

		constructor(gl: WebGLRenderingContext, extensions: any, capabilities: any);
		//constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, extensions: any, capabilities: any);
		convert(p: any): void;

	}


	export class WebGLCubeRenderTarget extends WebGLRenderTarget {

		constructor(
			size: number,
			options?: WebGLRenderTargetOptions
		);

		fromEquirectangularTexture(renderer: WebGLRenderer, texture: Texture): this;

	}


	export class WebGLMultisampleRenderTarget extends WebGLRenderTarget {

		constructor(
			width: number,
			height: number,
			options?: WebGLRenderTargetOptions
		);

		readonly isWebGLMultisampleRenderTarget: true;

		/**
		 * Specifies the number of samples to be used for the renderbuffer storage.However, the maximum supported size for multisampling is platform dependent and defined via gl.MAX_SAMPLES.
		 */
		samples: number;

	}


	export interface Renderer {
		domElement: HTMLCanvasElement;

		render(scene: Scene, camera: Camera): void;
		setSize(width: number, height: number, updateStyle?: boolean): void;
	}

	export interface WebGLRendererParameters {
		/**
		 * A Canvas where the renderer draws its output.
		 */
		canvas?: HTMLCanvasElement;
		//canvas?: HTMLCanvasElement | OffscreenCanvas;
		/**
		 * A WebGL Rendering Context.
		 * (https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)
		 *	Default is null
		 */
		context?: WebGLRenderingContext;

		/**
		 *	shader precision. Can be "highp", "mediump" or "lowp".
		 */
		precision?: string;

		/**
		 * default is false.
		 */
		alpha?: boolean;

		/**
		 * default is true.
		 */
		premultipliedAlpha?: boolean;

		/**
		 * default is false.
		 */
		antialias?: boolean;

		/**
		 * default is true.
		 */
		stencil?: boolean;

		/**
		 * default is false.
		 */
		preserveDrawingBuffer?: boolean;

		/**
		 *	Can be "high-performance", "low-power" or "default"
		 */
		powerPreference?: string;

		/**
		 * default is true.
		 */
		depth?: boolean;

		/**
		 * default is false.
		 */
		logarithmicDepthBuffer?: boolean;
	}

	export interface WebGLDebug {

		/**
		 * Enables error checking and reporting when shader programs are being compiled.
		 */
		checkShaderErrors: boolean;

	}

	/**
	 * The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
	 * This renderer has way better performance than CanvasRenderer.
	 *
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js">src/renderers/WebGLRenderer.js</a>
	 */
	export class WebGLRenderer implements Renderer {

		/**
		 * parameters is an optional object with properties defining the renderer's behaviour. The constructor also accepts no parameters at all. In all cases, it will assume sane defaults when parameters are missing.
		 */
		constructor(parameters?: WebGLRendererParameters);

		/**
		 * A Canvas where the renderer draws its output.
		 * This is automatically created by the renderer in the constructor (if not provided already); you just need to add it to your page.
		 */
		domElement: HTMLCanvasElement;

		/**
		 * The HTML5 Canvas's 'webgl' context obtained from the canvas where the renderer will draw.
		 */
		context: WebGLRenderingContext;

		/**
		 * Defines whether the renderer should automatically clear its output before rendering.
		 */
		autoClear: boolean;

		/**
		 * If autoClear is true, defines whether the renderer should clear the color buffer. Default is true.
		 */
		autoClearColor: boolean;

		/**
		 * If autoClear is true, defines whether the renderer should clear the depth buffer. Default is true.
		 */
		autoClearDepth: boolean;

		/**
		 * If autoClear is true, defines whether the renderer should clear the stencil buffer. Default is true.
		 */
		autoClearStencil: boolean;

		/**
		 * Debug configurations.
		 */
		debug: WebGLDebug;

		/**
		 * Defines whether the renderer should sort objects. Default is true.
		 */
		sortObjects: boolean;

		clippingPlanes: any[];
		localClippingEnabled: boolean;

		extensions: WebGLExtensions;

		/**
		 * Default is LinearEncoding.
		 */
		outputEncoding: TextureEncoding;

		physicallyCorrectLights: boolean;
		toneMapping: ToneMapping;
		toneMappingExposure: number;
		toneMappingWhitePoint: number;

		/**
		 * Default is false.
		 */
		shadowMapDebug: boolean;

		/**
		 * Default is 8.
		 */
		maxMorphTargets: number;

		/**
		 * Default is 4.
		 */
		maxMorphNormals: number;

		info: WebGLInfo;

		shadowMap: WebGLShadowMap;

		pixelRatio: number;

		capabilities: WebGLCapabilities;
		properties: WebGLProperties;
		renderLists: WebGLRenderLists;
		state: WebGLState;

		xr: WebXRManager;

		/**
		 * Return the WebGL context.
		 */
		getContext(): WebGLRenderingContext;
		getContextAttributes(): any;
		forceContextLoss(): void;

		/**
		 * @deprecated Use {@link WebGLCapabilities#getMaxAnisotropy .capabilities.getMaxAnisotropy()} instead.
		 */
		getMaxAnisotropy(): number;

		/**
		 * @deprecated Use {@link WebGLCapabilities#precision .capabilities.precision} instead.
		 */
		getPrecision(): string;

		getPixelRatio(): number;
		setPixelRatio(value: number): void;

		getDrawingBufferSize(target: Vector2): Vector2;
		setDrawingBufferSize(width: number, height: number, pixelRatio: number): void;

		getSize(target: Vector2): Vector2;

		/**
		 * Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
		 */
		setSize(width: number, height: number, updateStyle?: boolean): void;

		getCurrentViewport(target: Vector4): Vector4;

		/**
		 * Copies the viewport into target.
		 */
		getViewport(target: Vector4): Vector4;

		/**
		 * Sets the viewport to render from (x, y) to (x + width, y + height).
		 * (x, y) is the lower-left corner of the region.
		 */
		setViewport(x: Vector4 | number, y?: number, width?: number, height?: number): void;

		/**
		 * Copies the scissor area into target.
		 */
		getScissor(target: Vector4): Vector4;

		/**
		 * Sets the scissor area from (x, y) to (x + width, y + height).
		 */
		setScissor(x: Vector4 | number, y?: number, width?: number, height?: number): void;

		/**
		 * Returns true if scissor test is enabled; returns false otherwise.
		 */
		getScissorTest(): boolean;

		/**
		 * Enable the scissor test. When this is enabled, only the pixels within the defined scissor area will be affected by further renderer actions.
		 */
		setScissorTest(enable: boolean): void;

		/**
		 * Sets the custom opaque sort function for the WebGLRenderLists. Pass null to use the default painterSortStable function.
		 */
		setOpaqueSort(method: Function): void;

		/**
		 * Sets the custom transparent sort function for the WebGLRenderLists. Pass null to use the default reversePainterSortStable function.
		 */
		setTransparentSort(method: Function): void;

		/**
		 * Returns a THREE.Color instance with the current clear color.
		 */
		getClearColor(): Color;

		/**
		 * Sets the clear color, using color for the color and alpha for the opacity.
		 */
		setClearColor(color: Color, alpha?: number): void;
		setClearColor(color: string, alpha?: number): void;
		setClearColor(color: number, alpha?: number): void;

		/**
		 * Returns a float with the current clear alpha. Ranges from 0 to 1.
		 */
		getClearAlpha(): number;

		setClearAlpha(alpha: number): void;

		/**
		 * Tells the renderer to clear its color, depth or stencil drawing buffer(s).
		 * Arguments default to true
		 */
		clear(color?: boolean, depth?: boolean, stencil?: boolean): void;

		clearColor(): void;
		clearDepth(): void;
		clearStencil(): void;
		clearTarget(
			renderTarget: WebGLRenderTarget,
			color: boolean,
			depth: boolean,
			stencil: boolean
		): void;

		/**
		 * @deprecated Use {@link WebGLState#reset .state.reset()} instead.
		 */
		resetGLState(): void;
		dispose(): void;

		renderBufferImmediate(
			object: Object3D,
			program: WebGLProgram,
		): void;

		renderBufferDirect(
			camera: Camera,
			scene: Scene,
			geometry: Geometry | BufferGeometry,
			material: Material,
			object: Object3D,
			geometryGroup: any
		): void;

		/**
		 * A build in function that can be used instead of requestAnimationFrame. For WebXR projects this function must be used.
		 * @param callback The function will be called every available frame. If `null` is passed it will stop any already ongoing animation.
		 */
		setAnimationLoop(callback: Function | null): void;

		/**
		 * @deprecated Use {@link WebGLRenderer#setAnimationLoop .setAnimationLoop()} instead.
		 */
		animate(callback: Function): void;

		/**
		 * Compiles all materials in the scene with the camera. This is useful to precompile shaders before the first rendering.
		 */
		compile(
			scene: Scene,
			camera: Camera
		): void;

		/**
		 * Render a scene using a camera.
		 * The render is done to a previously specified {@link WebGLRenderTarget#renderTarget .renderTarget} set by calling
		 * {@link WebGLRenderer#setRenderTarget .setRenderTarget} or to the canvas as usual.
		 *
		 * By default render buffers are cleared before rendering but you can prevent this by setting the property
		 * {@link WebGLRenderer#autoClear autoClear} to false. If you want to prevent only certain buffers being cleared
		 * you can set either the {@link WebGLRenderer#autoClearColor autoClearColor},
		 * {@link WebGLRenderer#autoClearStencil autoClearStencil} or {@link WebGLRenderer#autoClearDepth autoClearDepth}
		 * properties to false. To forcibly clear one ore more buffers call {@link WebGLRenderer#clear .clear}.
		 */
		render(
			scene: Scene,
			camera: Camera
		): void;

		/**
		 * Returns the current active cube face.
		 */
		getActiveCubeFace(): number;

		/**
		 * Returns the current active mipmap level.
		 */
		getActiveMipmapLevel(): number;

		/**
		 * Sets the given WebGLFramebuffer. This method can only be used if no render target is set via
		 * {@link WebGLRenderer#setRenderTarget .setRenderTarget}.
		 *
		 * @param value The WebGLFramebuffer.
		 */
		setFramebuffer(value: WebGLFramebuffer): void;

		/**
		 * Returns the current render target. If no render target is set, null is returned.
		 */
		getRenderTarget(): RenderTarget | null;

		/**
		 * @deprecated Use {@link WebGLRenderer#getRenderTarget .getRenderTarget()} instead.
		 */
		getCurrentRenderTarget(): RenderTarget | null;

		/**
		 * Sets the active render target.
		 *
		 * @param renderTarget The {@link WebGLRenderTarget renderTarget} that needs to be activated. When `null` is given, the canvas is set as the active render target instead.
		 * @param activeCubeFace Specifies the active cube side (PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5) of {@link WebGLCubeRenderTarget}.
		 * @param activeMipmapLevel Specifies the active mipmap level.
		 */
		setRenderTarget(renderTarget: RenderTarget | null, activeCubeFace?: number, activeMipmapLevel?: number): void;

		readRenderTargetPixels(
			renderTarget: RenderTarget,
			x: number,
			y: number,
			width: number,
			height: number,
			buffer: any,
			activeCubeFaceIndex?: number
		): void;

		/**
		 * Copies a region of the currently bound framebuffer into the selected mipmap level of the selected texture.
		 * This region is defined by the size of the destination texture's mip level, offset by the input position.
		 *
		 * @param position Specifies the pixel offset from which to copy out of the framebuffer.
		 * @param texture Specifies the destination texture.
		 * @param level Specifies the destination mipmap level of the texture.
		 */
		copyFramebufferToTexture(position: Vector2, texture: Texture, level?: number): void;

		/**
		 * Copies srcTexture to the specified level of dstTexture, offset by the input position.
		 *
		 * @param position Specifies the pixel offset into the dstTexture where the copy will occur.
		 * @param srcTexture Specifies the source texture.
		 * @param dstTexture Specifies the destination texture.
		 * @param level Specifies the destination mipmap level of the texture.
		 */
		copyTextureToTexture(position: Vector2, srcTexture: Texture, dstTexture: Texture, level?: number): void;

		/**
		 * Initializes the given texture. Can be used to preload a texture rather than waiting until first render (which can cause noticeable lags due to decode and GPU upload overhead).
		 *
		 * @param texture The texture to Initialize.
		 */
		initTexture(texture: Texture): void;

		/**
		 * @deprecated
		 */
		gammaFactor: number;

		/**
		 * @deprecated Use {@link WebGLRenderer#xr .xr} instead.
		 */
		vr: boolean;

		/**
		 * @deprecated Use {@link WebGLShadowMap#enabled .shadowMap.enabled} instead.
		 */
		shadowMapEnabled: boolean;

		/**
		 * @deprecated Use {@link WebGLShadowMap#type .shadowMap.type} instead.
		 */
		shadowMapType: ShadowMapType;

		/**
		 * @deprecated Use {@link WebGLShadowMap#cullFace .shadowMap.cullFace} instead.
		 */
		shadowMapCullFace: CullFace;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'OES_texture_float' )} instead.
		 */
		supportsFloatTextures(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'OES_texture_half_float' )} instead.
		 */
		supportsHalfFloatTextures(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'OES_standard_derivatives' )} instead.
		 */
		supportsStandardDerivatives(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'WEBGL_compressed_texture_s3tc' )} instead.
		 */
		supportsCompressedTextureS3TC(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'WEBGL_compressed_texture_pvrtc' )} instead.
		 */
		supportsCompressedTexturePVRTC(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'EXT_blend_minmax' )} instead.
		 */
		supportsBlendMinMax(): any;

		/**
		 * @deprecated Use {@link WebGLCapabilities#vertexTextures .capabilities.vertexTextures} instead.
		 */
		supportsVertexTextures(): any;

		/**
		 * @deprecated Use {@link WebGLExtensions#get .extensions.get( 'ANGLE_instanced_arrays' )} instead.
		 */
		supportsInstancedArrays(): any;

		/**
		 * @deprecated Use {@link WebGLRenderer#setScissorTest .setScissorTest()} instead.
		 */
		enableScissorTest(boolean: any): any;

	}


	export interface WebGLRenderTargetOptions {
		wrapS?: Wrapping;
		wrapT?: Wrapping;
		magFilter?: TextureFilter;
		minFilter?: TextureFilter;
		format?: number; // RGBAFormat;
		type?: TextureDataType; // UnsignedByteType;
		anisotropy?: number; // 1;
		depthBuffer?: boolean; // true;
		stencilBuffer?: boolean; // true;
		generateMipmaps?: boolean; // true;
		depthTexture?: DepthTexture;
	}

	export class WebGLRenderTarget extends EventDispatcher {

		constructor(
			width: number,
			height: number,
			options?: WebGLRenderTargetOptions
		);

		uuid: string;
		width: number;
		height: number;
		scissor: Vector4;
		scissorTest: boolean;
		viewport: Vector4;
		texture: Texture;
		depthBuffer: boolean;
		stencilBuffer: boolean;
		depthTexture: DepthTexture;
		readonly isWebGLRenderTarget: true;

		/**
		 * @deprecated Use {@link Texture#wrapS texture.wrapS} instead.
		 */
		wrapS: any;
		/**
		 * @deprecated Use {@link Texture#wrapT texture.wrapT} instead.
		 */
		wrapT: any;
		/**
		 * @deprecated Use {@link Texture#magFilter texture.magFilter} instead.
		 */
		magFilter: any;
		/**
		 * @deprecated Use {@link Texture#minFilter texture.minFilter} instead.
		 */
		minFilter: any;
		/**
		 * @deprecated Use {@link Texture#anisotropy texture.anisotropy} instead.
		 */
		anisotropy: any;
		/**
		 * @deprecated Use {@link Texture#offset texture.offset} instead.
		 */
		offset: any;
		/**
		 * @deprecated Use {@link Texture#repeat texture.repeat} instead.
		 */
		repeat: any;
		/**
		 * @deprecated Use {@link Texture#format texture.format} instead.
		 */
		format: any;
		/**
		 * @deprecated Use {@link Texture#type texture.type} instead.
		 */
		type: any;
		/**
		 * @deprecated Use {@link Texture#generateMipmaps texture.generateMipmaps} instead.
		 */
		generateMipmaps: any;

		setSize(width: number, height: number): void;
		clone(): this;
		copy(source: WebGLRenderTarget): this;
		dispose(): void;

	}


	export class WebXRController {

		constructor();

		getTargetRaySpace(): Group;
		getGripSpace(): Group;
		dispatchEvent(event: any): this;
		disconnect(inputSource: any): this;
		update(inputSource: any, frame: any, referenceSpace: string): this;

	}


	export class WebXRManager {

		constructor(renderer: any, gl: WebGLRenderingContext);

		enabled: boolean;
		isPresenting: boolean;
		getController(id: number): Group;
		getControllerGrip(id: number): Group;
		setFramebufferScaleFactor(value: number): void;
		setReferenceSpaceType(value: string): void;
		getReferenceSpace(): any;
		getSession(): any;
		setSession(value: any): void;
		getCamera(camera: Camera): Camera;
		setAnimationLoop(callback: Function): void;
		dispose(): void;

	}


	export interface IFog {
		name: string;
		color: Color;
		clone(): this;
		toJSON(): any;
	}

	/**
	 * This class contains the parameters that define linear fog, i.e., that grows linearly denser with the distance.
	 */
	export class Fog implements IFog {

		constructor(hex: number, near?: number, far?: number);

		name: string;

		/**
		 * Fog color.
		 */
		color: Color;

		/**
		 * The minimum distance to start applying fog. Objects that are less than 'near' units from the active camera won't be affected by fog.
		 */
		near: number;

		/**
		 * The maximum distance at which fog stops being calculated and applied. Objects that are more than 'far' units away from the active camera won't be affected by fog.
		 * Default is 1000.
		 */
		far: number;

		readonly isFog: true;

		clone(): this;
		toJSON(): any;

	}

	/**
	 * This class contains the parameters that define linear fog, i.e., that grows exponentially denser with the distance.
	 */
	export class FogExp2 implements IFog {

		constructor(hex: number | string, density?: number);

		name: string;
		color: Color;

		/**
		 * Defines how fast the fog will grow dense.
		 * Default is 0.00025.
		 */
		density: number;

		readonly isFogExp2: true;

		clone(): this;
		toJSON(): any;

	}

	// Scenes /////////////////////////////////////////////////////////////////////

	/**
	 * Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
	 */
	export class Scene extends Object3D {

		constructor();

		type: 'Scene';

		/**
		 * A fog instance defining the type of fog that affects everything rendered in the scene. Default is null.
		 */
		fog: IFog | null;

		/**
		 * If not null, it will force everything in the scene to be rendered with that material. Default is null.
		 */
		overrideMaterial: Material | null;
		autoUpdate: boolean;
		background: null | Color | Texture | THREE.WebGLRenderTarget;
		environment: null | Texture;

		readonly isScene: true;

		toJSON(meta?: any): any;
		dispose(): void;

	}


	export class CanvasTexture extends Texture {

		constructor(
			canvas: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			format?: PixelFormat,
			type?: TextureDataType,
			anisotropy?: number
		);

	}



	export class CompressedTexture extends Texture {

		constructor(
			mipmaps: ImageData[],
			width: number,
			height: number,
			format?: CompressedPixelFormat,
			type?: TextureDataType,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			anisotropy?: number,
			encoding?: TextureEncoding
		);

		image: { width: number; height: number };

	}

	export class CubeTexture extends Texture {

		constructor(
			images?: any[], // HTMLImageElement or HTMLCanvasElement
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			format?: PixelFormat,
			type?: TextureDataType,
			anisotropy?: number,
			encoding?: TextureEncoding
		);

		images: any; // returns and sets the value of Texture.image in the codde ?

	}



	export class DataTexture extends Texture {

		constructor(
			data: TypedArray,
			width: number,
			height: number,
			format?: PixelFormat,
			type?: TextureDataType,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			anisotropy?: number,
			encoding?: TextureEncoding
		);

		image: ImageData;

	}


	export class DataTexture2DArray extends Texture {

		constructor(
			data: TypedArray,
			width: number,
			height: number,
			depth: number
		);

	}


	export class DataTexture3D extends Texture {

		constructor(
			data: TypedArray,
			width: number,
			height: number,
			depth: number
		);

	}


	export class DepthTexture extends Texture {

		constructor(
			width: number,
			heighht: number,
			type?: TextureDataType,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			anisotropy?: number
		);

		image: { width: number; height: number };

	}


	// Textures /////////////////////////////////////////////////////////////////////
	export let TextureIdCount: number;

	export class Texture extends EventDispatcher {

		constructor(
			image?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			format?: PixelFormat,
			type?: TextureDataType,
			anisotropy?: number,
			encoding?: TextureEncoding
		);

		id: number;
		uuid: string;
		name: string;
		sourceFile: string;
		image: any; // HTMLImageElement or ImageData or { width: number, height: number } in some children;
		mipmaps: ImageData[];
		mapping: Mapping;
		wrapS: Wrapping;
		wrapT: Wrapping;
		magFilter: TextureFilter;
		minFilter: TextureFilter;
		anisotropy: number;
		format: PixelFormat;
		internalFormat: PixelFormatGPU | null;
		type: TextureDataType;
		offset: Vector2;
		repeat: Vector2;
		center: Vector2;
		rotation: number;
		generateMipmaps: boolean;
		premultiplyAlpha: boolean;
		flipY: boolean;
		unpackAlignment: number;
		encoding: TextureEncoding;
		version: number;
		needsUpdate: boolean;
		readonly isTexture: true;

		onUpdate: () => void;
		static DEFAULT_IMAGE: any;
		static DEFAULT_MAPPING: any;

		clone(): this;
		copy(source: Texture): this;
		toJSON(meta: any): any;
		dispose(): void;
		transformUv(uv: Vector2): Vector2;

	}


	export class VideoTexture extends Texture {

		constructor(
			video: HTMLVideoElement,
			mapping?: Mapping,
			wrapS?: Wrapping,
			wrapT?: Wrapping,
			magFilter?: TextureFilter,
			minFilter?: TextureFilter,
			format?: PixelFormat,
			type?: TextureDataType,
			anisotropy?: number
		);

		readonly isVideoTexture: true;

	}


	export namespace SceneUtils {
		export function createMultiMaterialObject(
			geometry: Geometry,
			materials: Material[]
		): Object3D;
		export function detach(child: Object3D, parent: Object3D, scene: Scene): void;
		export function attach(child: Object3D, scene: Scene, parent: Object3D): void;
	}

	/**
	 * @deprecated Use an Array instead.
	 */
	export class MultiMaterial extends Material {

		constructor(materials?: Material[]);

		readonly isMultiMaterial: true;

		materials: Material[];

		toJSON(meta: any): any;

	}

	/**
	 * @deprecated Material.vertexColors is now a boolean.
	 */
	export enum Colors { }
	export const NoColors: Colors;
	export const FaceColors: Colors;
	export const VertexColors: Colors;

	export function arrayMin(array: number[]): number;
	export function arrayMax(array: number[]): number;
}