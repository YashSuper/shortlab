# Product Requirements Document (PRD)
# ShrinkLab — Privacy-First Image Optimizer

**Document status:** Product scope finalized; implementation specification  
**Product name:** ShrinkLab  
**Product category:** Image optimization and transformation  
**Platforms:** Web application + Chrome extension  
**Primary language:** English  
**Target markets:** US, UK, Canada, Australia and Western Europe  
**Primary users:** Website owners, marketers, freelancers, e-commerce sellers and professionals  
**Document purpose:** Source of truth for AI coding agents, developers and product implementation.

---

# 1. Executive Summary

ShrinkLab is a privacy-first image optimization application that enables users to transform images into their required formats, dimensions, aspect ratios and file sizes.

Users should be able to upload one image or an entire batch, configure their desired output specifications, and let ShrinkLab execute the complete transformation through a unified processing pipeline.

The application must support:

1. Image format conversion.
2. Target file-size optimization.
3. Aspect-ratio transformation using crop or contain-with-background modes.
4. Batch image processing.
5. A unified, configurable image transformation pipeline.

The product must prioritize precision, output quality, speed, simplicity and local processing.

## Product positioning

**Prepare every image exactly how you need it.**

Convert, crop, resize and compress images in one workflow.

## Core value proposition

Users specify what they need. ShrinkLab determines how to transform the original image to produce the requested output.

The user should not need separate applications for cropping, resizing, format conversion and compression.

---

# 2. Product Vision and Principles

## 2.1 Vision

Build the most convenient image optimization utility for people who regularly need images to meet specific technical requirements.

## 2.2 Product principles

1. **Outcome-oriented:** Users specify desired output rather than manually performing several transformations.
2. **Precision:** Requested dimensions, aspect ratios and file-size constraints must be validated.
3. **Quality preservation:** Preserve as much visual quality as possible while meeting output constraints.
4. **Local-first:** Image processing happens on the user's device.
5. **Batch-ready:** Every transformation must work for individual images and batches.
6. **Unified pipeline:** One processing engine powers all workflows.
7. **Simple interface:** Avoid the complexity of a general-purpose photo editor.
8. **Non-destructive:** Always preserve the original source image during processing.

## 2.3 Non-goals

ShrinkLab is not intended to become:

- A Photoshop or Canva replacement.
- A general photo editor.
- An AI image generation platform.
- A background-removal application.
- A cloud image storage service.
- A collaborative design application.
- A video processing application.

---

# 3. Target Users and Use Cases

## 3.1 Target user segments

| Segment | Primary need |
|---|---|
| Website owners | Optimize images for web performance |
| Digital marketers | Prepare images for different platforms |
| Freelancers | Deliver images with exact specifications |
| E-commerce sellers | Standardize product image dimensions |
| Content creators | Resize and convert images |
| Office professionals | Meet image upload requirements |

## 3.2 Core user stories

### Format conversion

As a user, I want to convert an image from one format to another so that it is compatible with the platform where I intend to use it.

### Target file size

As a user, I want to specify a maximum file size so that my image meets an upload or attachment requirement without manually adjusting compression settings.

### Aspect ratio

As a user, I want to specify an aspect ratio and choose between cropping or fitting the complete image with a solid background.

### Exact dimensions

As a user, I want to specify exact output dimensions so that my image meets the requirements of a website, marketplace or other platform.

### Batch processing

As a user, I want to apply the same transformation settings to multiple images so that I can prepare many assets without processing each one individually.

### Unified workflow

As a user, I want to configure all my image requirements in one place and generate the final optimized image in a single operation.

---

# 4. Functional Scope

The MVP consists of the following capabilities.

## 4.1 Image Format Conversion

### Requirement

Users must be able to convert supported image files into other supported output formats.

### Initial input formats

- JPEG / JPG
- PNG
- WebP

### Initial output formats

- JPEG
- PNG
- WebP

### Subsequent format support

- AVIF
- HEIC / HEIF
- TIFF
- BMP
- SVG rasterization
- Animated GIF optimization

These formats must not be represented as fully supported until their decoding, encoding, browser compatibility and security requirements are implemented and tested.

### Functional requirements

- Detect the original image format.
- Display the original format.
- Allow users to select an output format.
- Decode and encode the image correctly.
- Preserve transparency when supported by the output format.
- Warn users when converting a transparent image into JPEG.
- Validate the generated output.
- Display the resulting file size.
- Allow downloading the converted image.

### Acceptance criteria

- JPEG can be converted to PNG and WebP.
- PNG can be converted to JPEG and WebP.
- WebP can be converted to JPEG and PNG.
- Output files open correctly in supported viewers.
- Transparency is preserved in compatible formats.
- The application does not silently discard important image content.

---

## 4.2 Target File-Size Optimization

### Requirement

Users must be able to specify a maximum output file size.

Examples:

- Maximum 100 KB.
- Maximum 200 KB.
- Maximum 500 KB.
- Maximum 1 MB.
- Custom size.

Support KB and MB units.

The target must be interpreted as a maximum file-size constraint, not an instruction to generate an artificially padded file of exactly that size.

### User workflow

1. Select an image.
2. Configure the output format.
3. Specify the maximum file size.
4. Configure dimensions and aspect ratio if required.
5. Start optimization.
6. The system automatically searches for an acceptable encoding configuration.
7. Validate the output.
8. Return the best result.

### Optimization requirements

- Automatically adjust encoding quality for lossy formats.
- Use an appropriate optimization strategy for each output format.
- Avoid unnecessary repeated image decoding.
- Measure the actual encoded output size.
- Stop when the output satisfies the requested maximum.
- Stop when further optimization cannot reasonably produce an acceptable result.
- Never report a target as achieved unless the actual output meets it.

### Format-specific behavior

**JPEG**

- Use lossy quality optimization.
- Search for the highest quality that satisfies the target.
- Allow a configurable quality floor.

**WebP**

- Support lossy quality optimization.
- Evaluate browser encoder behavior.
- Select the highest acceptable quality that meets the target.

**PNG**

- Use lossless encoding and supported PNG optimization.
- Do not expose a misleading lossy-quality slider.
- If the target cannot be reached, explain the limitation.
- Offer alternative formats where appropriate.

**AVIF**

- Add only after reliable encoder support is established.
- Benchmark encoding speed and quality.

### Optimization algorithm

The engine should use an iterative optimization strategy.

For lossy formats:

1. Generate an initial output.
2. Measure the output size.
3. Compare it against the target.
4. If the file is too large, lower quality.
5. If it is comfortably below the target, test whether higher quality is possible.
6. Use binary search or another suitable bounded search algorithm.
7. Return the highest-quality result that satisfies the target and configured quality floor.

Quality-to-file-size behavior is not guaranteed to be perfectly monotonic across all encoders and images. The implementation must therefore verify actual outputs and have bounded retry logic.

### Target-size failure handling

If the requested size cannot be achieved:

- Return the best valid candidate.
- Mark the target as not achieved.
- Display actual output size.
- Explain why the target was not reached.
- Suggest reducing dimensions or choosing another output format.
- Allow the user to retry with different settings.

The system must never silently change user-selected dimensions or aspect ratio to satisfy a file-size target.

### Acceptance criteria

- Target sizes are validated against actual encoded file sizes.
- Successful outputs never exceed the configured maximum.
- Failure states clearly identify unmet constraints.
- Optimization terminates within configured time and attempt limits.
- The highest acceptable quality is preferred over unnecessary additional compression.

---

## 4.3 Aspect-Ratio Transformation

### Requirement

Users must be able to specify an aspect ratio and choose one of two fitting methods.

### Supported fitting methods

#### Mode A: Crop to Fill

The source image is cropped to fill the target aspect ratio.

Requirements:

- Preserve the target aspect ratio.
- Allow interactive crop positioning.
- Support center cropping by default.
- Allow manual repositioning.
- Allow crop-area adjustment.
- Avoid empty areas in the output.
- Preserve the selected crop when changing compression settings.

#### Mode B: Contain with Solid Background

The entire original image must fit inside the target aspect ratio.

Requirements:

- Preserve the complete image.
- Scale proportionally to fit the target canvas.
- Create a canvas with the requested aspect ratio.
- Fill the remaining space with a solid background color.
- Allow manual background-color selection.
- Support automatic background-color suggestions.

### Background color options

- White.
- Black.
- Custom color.
- Hex color input.
- Automatic image-based color matching.

### Automatic background matching

The application should analyze image edge colors and generate a suitable background suggestion.

Possible implementation approaches:

- Sample colors near image boundaries.
- Calculate representative edge colors.
- Use a median or weighted average.
- Offer the result as a suggested solid background color.

Automatic matching must remain optional. Users must be able to select another color manually.

Do not describe this as AI-powered unless an actual AI implementation is introduced.

### Aspect-ratio presets

Initial presets:

- 1:1
- 4:3
- 3:2
- 16:9
- 9:16
- 4:5
- 5:4

Users must also be able to enter a custom ratio.

### Acceptance criteria

- Crop mode fills the requested canvas without empty areas.
- Contain mode preserves the entire source image.
- Contain mode fills unused areas with the selected background.
- Output aspect ratio matches the requested ratio.
- Manual crop positioning works correctly.
- Custom aspect ratios are supported.
- Changing the fitting mode does not destroy the original source.

---

## 4.4 Exact Image Dimensions and Resizing

### Requirement

Users must be able to specify exact output dimensions.

### Controls

- Width in pixels.
- Height in pixels.
- Maintain aspect ratio toggle.
- Independent width and height controls.
- Percentage-based resizing.
- Preset dimensions.
- Custom dimensions.

### Rules

- Output dimensions must be positive integers.
- Dimensions must respect configured browser and engine limits.
- Maintain-aspect-ratio behavior must be predictable.
- When the user explicitly specifies both dimensions, the selected aspect-ratio fitting mode determines how the image is composed.
- The final output must have the exact requested dimensions.

### Important distinction

Aspect ratio and output dimensions are related but different concepts.

For example:

- Aspect ratio: 16:9.
- Output dimensions: 1200 × 675 pixels.

The ratio determines the shape. Dimensions determine the resolution.

Both should be independently represented in the processing configuration.

### Acceptance criteria

- Requested output dimensions match the actual decoded output dimensions.
- Maintain-aspect-ratio behavior works correctly.
- Invalid dimensions are rejected.
- Very large dimensions are handled safely.
- The original image remains unchanged.

---

## 4.5 Batch Processing

### Requirement

Users must be able to process multiple images with one shared configuration.

Batch processing is a core MVP requirement, not a future enhancement.

### Input

- Multiple file selection.
- Drag-and-drop multiple files.
- Supported image formats only.

### Batch configuration

Users configure a shared transformation profile:

- Output format.
- Target file size.
- Aspect ratio.
- Crop or contain mode.
- Background color.
- Output dimensions.
- Compression settings.
- Metadata policy.

### Batch processing behavior

- Apply shared settings to every selected image.
- Maintain individual processing status.
- Allow per-image overrides.
- Preserve the original filename by default.
- Generate unique output filenames.
- Avoid overwriting source files.
- Allow failed items to be retried.
- Allow individual downloads.
- Allow complete batch download as ZIP.

### Batch processing interface

Each file should display:

- Filename.
- Thumbnail.
- Original dimensions.
- Original file size.
- Processing status.
- Output dimensions.
- Output size.
- Target-size status.
- Error message, if applicable.

### Batch execution requirements

- Process images with bounded concurrency.
- Avoid loading every full-resolution image into memory simultaneously.
- Use workers where appropriate.
- Provide progress reporting.
- Allow cancellation where technically supported.
- Release resources after each job.
- Continue processing other files if one image fails.

### Acceptance criteria

- Multiple supported images can be selected together.
- Shared settings apply consistently.
- One image failure does not abort the entire batch.
- Individual output downloads work.
- ZIP export contains successful outputs.
- Output filenames are unique and predictable.
- Per-image overrides do not affect unrelated files.

---

## 4.6 Before-and-After Comparison

### Requirement

Users should be able to inspect the output before downloading.

Requirements:

- Original image preview.
- Optimized image preview.
- Side-by-side comparison.
- Original dimensions.
- Output dimensions.
- Original file size.
- Output file size.
- Percentage reduction.
- Target-size achievement status.

The preview must use the actual generated output rather than an estimated representation.

---

## 4.7 Metadata Management

### MVP behavior

- Correct image orientation.
- Strip unnecessary metadata by default.
- Avoid exposing GPS or sensitive metadata.
- Preserve only metadata that can be safely retained and is explicitly supported.
- Do not claim complete metadata preservation without testing.

A later version may provide an explicit preserve/strip preference.

---

## 4.8 Smart Export

### Requirements

- Preserve original filename.
- Add a configurable output suffix, defaulting to `-optimized`.
- Update file extension to match output format.
- Prevent filename collisions.
- Support individual downloads.
- Support ZIP downloads for batches.
- Never overwrite original files.

---

## 4.9 Marketplace Image Compliance Presets

### Requirement

Users must be able to select a target marketplace and have ShrinkLab validate and transform the image to match that marketplace's published image requirements, using the existing unified pipeline.

This is a preset layer over the existing `OptimizationConfig`, not a new processing engine. A preset is data that pre-fills format, dimensions, background and target file size; it introduces no new transform.

### Phase 1 scope: Amazon only

Only Amazon is implemented for now. Etsy, Shopify, Walmart and eBay are deferred — do not add presets for them from memory or assumption. Each must go through the same sourcing process as Amazon below before it is added: pull the marketplace's own current published image guide, quote the exact figures, cite the URL and date.

### Source

Seller Central Help → Listing quality guidelines → **Product image guide** (article id `G1881`).

- URL: `https://sellercentral.amazon.com/help/hub/reference/external/G1881`
- Retrieved: en-IN (India) locale version, via user-supplied page content (this sandbox cannot reach Seller Central directly — see note below).
- Verified: 2026-11-18.
- **Caveat:** the article content is Amazon's generic/global product-image standard (no India-specific pricing or regulatory text), but it has **not** been separately cross-checked against the en-US / en-GB / en-CA / en-AU / EU Seller Central versions of this same article. Project target markets (section: Target markets) are US, UK, Canada, Australia, Western Europe — re-confirm this article's figures against each target marketplace's own locale before marking any of them "supported," not just Amazon in general.
- This sandbox could not fetch Amazon pages directly: Seller Central requires login (redirects to sign-in), public amazon.com help nodes returned HTTP 503 (bot-blocked), and no web-search backend is available here. The figures below came from the user pasting the live page.

### Amazon MAIN image — mechanically validated rules

These are the rules ShrinkLab's engine can check exactly, with no content/vision judgment required:

| Field | Value | Notes |
|---|---|---|
| Allowed formats | JPEG (.jpg/.jpeg), TIFF (.tif/.tiff), PNG (.png), non-animated GIF (.gif) | JPEG recommended by Amazon. ShrinkLab currently only outputs JPEG/PNG/WebP (section 4.1) — TIFF/GIF input/output is out of scope until section 4.1's "subsequent format support" lands. WebP is **not** in Amazon's accepted list; do not offer WebP as an output choice under this preset. |
| Dimension | Minimum 500 px, maximum 10,000 px | On the **longest side**, not width/height independently. Amazon rejects uploads below 500 px; images must not be artificially upscaled to pass this floor. |
| Recommended dimension | 1,000+ px on longest side | Enables Amazon's zoom feature. Not a hard requirement, but ShrinkLab should recommend it by default. |
| Resolution | Minimum 72 dpi | |
| Colour mode | RGB (preferred, not stated as strictly required) | |
| Background | Pure white, RGB(255, 255, 255) exactly | Applies to the MAIN image only, not all variant images. |
| Max file size | **Not published in this article.** | Do not invent a number (earlier draft guessed 10MB — remove that guess; it was not sourced). |

Implementation note: the existing `MarketplacePreset` interface (below) models dimension limits as a `{width, height}` box. Amazon's rule is "longest side," which is orientation-independent — a 500×2000 portrait and a 2000×500 landscape are both valid. The data model needs `minLongestSidePx` / `maxLongestSidePx`, not a fixed width×height pair.

### Updated preset data model

```ts
interface MarketplacePreset {
  marketplaceId: string;
  label: string;
  minLongestSidePx?: number;
  maxLongestSidePx?: number;
  recommendedLongestSidePx?: number;
  minDpi?: number;
  requiredBackground?: "white" | null;
  minProductFillPercent?: number; // heuristic only, see below
  allowedFormats: SupportedFormat[];
  maxFileSizeBytes?: number; // omit when the marketplace publishes none — never a guessed default
  sourceUrl: string;
  lastVerified: string;
}

const AMAZON_MAIN_IMAGE: MarketplacePreset = {
  marketplaceId: "amazon",
  label: "Amazon — Main image",
  minLongestSidePx: 500,
  maxLongestSidePx: 10000,
  recommendedLongestSidePx: 1000,
  minDpi: 72,
  requiredBackground: "white",
  minProductFillPercent: 85,
  allowedFormats: ["jpeg", "png"],
  sourceUrl: "https://sellercentral.amazon.com/help/hub/reference/external/G1881",
  lastVerified: "2026-11-18",
};
```

### Product-fill check — heuristic, best-effort only

Amazon requires the product to occupy ~85% of the frame. This can be approximated (not guaranteed) by computing the bounding box of non-white pixels against total frame area, since the background must already be pure white. Treat this as a best-effort warning ("product may be smaller than Amazon's recommended fill"), never a hard pass/fail — the heuristic will misfire on products that are themselves white, or have fine/thin silhouettes.

### Not automatable — advisory checklist only, never shown as "compliant"

Amazon's guide also contains content/pose rules that require visual judgment, not pixel measurement. ShrinkLab has no image-content or vision-analysis capability (non-goal, section 2.3) and must not claim these are validated:

- No placeholder image.
- Entire product shown, not cropped/cut off.
- Product shown once only (e.g. not front and back together).
- Only one unit plus accessories actually included with the product — no extra props.
- No mannequins, in any form.
- Footwear: single shoe, facing left, 45° angle.
- Clothing accessories/multipacks: flat lay, no model.
- Adult clothing: shown on a standing model (not sitting, kneeling, leaning, lying).
- No text, pricing, star-rating/review imagery, or Amazon logos/trademarks/badges (e.g. "Amazon's Choice").
- Children's/baby undergarments, leotards, swimwear and similar: flat lay, no model.

Render these as a static checklist the user ticks off manually — do not wire them into the pass/fail validation pipeline.

### Known edge case: AI-generated-people metadata vs. metadata stripping

Amazon requires images containing photorealistic AI-generated people to carry an XMP/IPTC tag (`contains-synthetic-performer` in the `dc:subject` field) before upload. This conflicts with section 4.7's default "strip unnecessary metadata" behavior, which would silently remove that tag. Not required for MVP since ShrinkLab doesn't generate or detect AI people — document it now so a future metadata-strip pass doesn't silently strip a legally-required disclosure tag a user's source file already carries.

### Functional requirements

- Maintain the Amazon preset as data, not hardcoded logic.
- Display the preset's requirements before processing.
- Pre-fill `OptimizationConfig` from the preset (format, dimensions via longest-side constraint, white background).
- Allow the user to override any pre-filled value.
- After processing, validate format, longest-side range, dpi and exact-white background against the preset.
- Surface the product-fill heuristic as an advisory warning, not a pass/fail gate.
- Display the non-automatable checklist as a manual reminder, clearly separated from validated results.
- Apply the preset in both single-image and batch workflows.
- Carry the preset's source URL and last-verified date wherever its rules are shown in the UI.

### Data accuracy requirement

- Do not add Etsy, Shopify, Walmart or eBay presets without repeating this sourcing process for each.
- Re-verify the Amazon figures against the actual target-market Seller Central locales (US/UK/CA/AU/EU) before launch, not just the en-IN article used here.
- Re-verify on a recurring schedule (e.g. quarterly) and before any release that changes this preset.
- Never ship a numeric value in this section that wasn't read directly off a current official source.

### Acceptance criteria

- Selecting the Amazon preset pre-fills format, longest-side dimension range and white background.
- User can override any pre-filled preset value.
- Output is validated against the preset's mechanically-checkable rules (format, longest side, dpi, exact background color) after processing.
- Product-fill is shown as an advisory heuristic, never as a hard compliance pass/fail.
- The non-automatable checklist is visibly separated from validated results and never labeled "compliant."
- Preset works in batch mode with per-image override still available.
- The preset's source URL and last-verified date are visible wherever its rules are shown.

---

# 5. Unified Image Processing Pipeline

This is the most important architectural component of ShrinkLab.

All individual and batch processing must use the same shared image engine.

## 5.1 Processing sequence

The standard pipeline is:

1. Input validation.
2. Image decoding.
3. Orientation normalization.
4. Source inspection.
5. Aspect-ratio transformation.
6. Crop or contain with background.
7. Exact resizing.
8. Format conversion.
9. Compression optimization.
10. Output validation.
11. Export.

## 5.2 Pipeline principles

- Preserve the original source.
- Avoid repeated lossy transformations.
- Apply transformations to a common decoded source representation.
- Perform final encoding only after geometry operations.
- Measure the actual encoded output.
- Validate final dimensions and format.
- Keep processing independent of UI components.

## 5.3 Processing configuration

A single configuration object must describe all requested transformations.

Conceptual TypeScript interface:

```ts
type SupportedFormat = "jpeg" | "png" | "webp";

type FitMode = "crop" | "contain";

interface AspectRatio {
  width: number;
  height: number;
}

interface OutputDimensions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BackgroundConfig {
  mode: "auto" | "solid";
  color?: string;
}

interface OptimizationConfig {
  outputFormat: SupportedFormat;

  aspectRatio?: AspectRatio;

  fitMode?: FitMode;

  crop?: CropRegion;

  background?: BackgroundConfig;

  dimensions?: OutputDimensions;

  targetFileSizeBytes?: number;

  quality: number | "auto";

  metadataPolicy: "strip" | "preserve";
}
```

The actual production contract may evolve, but the shared engine must retain these domain concepts.

## 5.4 Processing result

```ts
interface OptimizationResult {
  blob: Blob;

  outputFormat: SupportedFormat;

  width: number;
  height: number;

  originalSizeBytes: number;
  outputSizeBytes: number;

  targetSizeBytes?: number;

  targetAchieved: boolean;

  qualityUsed?: number;

  warnings: string[];
}
```

Errors should be represented through typed error results or well-defined exceptions. Do not silently swallow failures.

---

# 6. Technical Architecture

## 6.1 Technology stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Frontend | React |
| Build tool | Vite |
| Styling | CSS or Tailwind CSS |
| Website | React application |
| Extension | Chrome Manifest V3 |
| Image decoding | createImageBitmap where supported |
| Image manipulation | Canvas / OffscreenCanvas |
| Image encoding | toBlob / convertToBlob |
| Background processing | Web Workers |
| Heavy processing | WebAssembly when justified |
| ZIP creation | Browser-compatible ZIP library |
| Testing | Vitest + Playwright |
| Monorepo | pnpm workspaces |
| Hosting | Static hosting + CDN |
| Payments | Hosted checkout |
| Licensing | Lightweight serverless API |

Do not introduce WebAssembly or third-party libraries without a clear technical reason.

Prefer native browser capabilities where they meet the required quality and compatibility standards.

## 6.2 Monorepo structure

```text
shrinklab/
│
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── pages/
│   │       ├── components/
│   │       ├── features/
│   │       │   ├── optimizer/
│   │       │   ├── batch/
│   │       │   └── editor/
│   │       └── main.tsx
│   │
│   └── extension/
│       └── src/
│           ├── popup/
│           ├── pages/
│           ├── background/
│           └── workers/
│
├── packages/
│   ├── image-engine/
│   │   ├── src/
│   │   │   ├── decoder/
│   │   │   ├── transforms/
│   │   │   ├── encoders/
│   │   │   ├── optimizer/
│   │   │   ├── pipeline/
│   │   │   └── validation/
│   │   └── workers/
│   │
│   ├── shared-ui/
│   ├── shared-types/
│   ├── shared-utils/
│   └── entitlements/
│
├── services/
│   └── licensing-api/
│
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## 6.3 Image engine responsibilities

The image engine must own:

- Format validation.
- Decoding.
- Orientation handling.
- Crop transformation.
- Contain transformation.
- Background color handling.
- Resizing.
- Format encoding.
- Target-size optimization.
- Output validation.
- Processing error handling.

The image engine must not depend on:

- React.
- Website routing.
- Chrome extension UI.
- DOM-specific editor state.
- Payment or licensing logic.

The UI supplies a validated configuration and receives processing results.

## 6.4 Worker architecture

Use Web Workers for computationally expensive operations.

Responsibilities:

- Execute processing jobs.
- Keep the main interface responsive.
- Manage job identifiers.
- Return results and progress.
- Propagate errors.
- Support cancellation where possible.
- Clean up resources.

Batch processing must use bounded concurrency.

Do not process an unlimited number of full-resolution images simultaneously.

## 6.5 Browser compatibility

The engine must not assume that all browsers implement identical image decoders and encoders.

Introduce capability detection.

For example:

- Check support for image formats.
- Check encoder availability.
- Handle missing OffscreenCanvas support.
- Provide appropriate fallbacks.
- Return clear unsupported-format errors.

Do not silently substitute a different output format when the requested format is unavailable.

---

# 7. Website Requirements

## 7.1 Primary pages

- Homepage.
- Image optimizer.
- Pricing.
- Privacy policy.
- Terms of service.
- FAQ.

## 7.2 Homepage

The homepage should communicate:

**Headline:** Every image, exactly how you need it.

**Supporting text:** Convert, crop, resize and compress images to your exact specifications. Process individual images or entire batches privately on your device.

Primary call to action:

- Upload images.

Secondary explanation:

- Format conversion.
- Target file size.
- Aspect-ratio control.
- Batch processing.
- Privacy-first processing.

## 7.3 Optimizer interface

The optimizer should have:

- Drag-and-drop area.
- File selection.
- Image preview.
- Transformation controls.
- Output settings.
- Processing status.
- Before-and-after comparison.
- Download controls.

Avoid creating separate applications for compression, conversion, cropping and resizing.

They should all be capabilities of the same optimizer.

## 7.4 Batch interface

The batch experience should include:

- File list.
- Shared configuration.
- Optional per-image settings.
- Individual status.
- Progress indicator.
- Retry action.
- ZIP export.

---

# 8. Chrome Extension Requirements

The Chrome extension is a convenience layer around the shared image engine.

## 8.1 Initial capabilities

- Toolbar popup.
- Open ShrinkLab optimizer.
- Select local images.
- Run image processing locally.
- Download results.
- Access premium features when entitled.

## 8.2 Architecture

Use Manifest V3.

Processing must happen in extension pages or dedicated workers, not inside the extension service worker.

The service worker should handle lightweight lifecycle and context-menu operations.

## 8.3 Permissions

Start with minimal permissions.

Potential permissions:

- `storage`
- `downloads`
- `contextMenus`

Request additional permissions only when required by a specific feature.

Do not request unrestricted access to all websites simply to process local images.

---

# 9. Monetization Requirements

## 9.1 Business model

Freemium with premium image optimization capabilities.

Basic compression should remain free.

Premium should unlock advanced control and workflow efficiency.

## 9.2 Proposed free features

- Individual image compression.
- Basic format conversion.
- Basic quality controls.
- Before-and-after preview.

## 9.3 Proposed premium features

- Advanced target-size optimization.
- Custom cropping.
- Exact dimensions.
- Advanced aspect-ratio controls.
- Custom background matching and controls.
- Batch processing.
- Batch presets.
- Marketplace compliance presets.

The final entitlement matrix must be explicitly configured rather than scattered through UI conditions.

## 9.4 Delayed/contextual monetization

- Do not block users with an immediate paywall.
- Allow useful free functionality from the first visit.
- Introduce upgrade prompts when users attempt premium capabilities.
- Do not arbitrarily disable free functionality after a fixed number of days.
- Measure repeat usage and premium feature engagement.

## 9.5 Initial pricing hypotheses

- Annual: $19.99.
- Lifetime: $39.99.

These prices are experimental and must be validated.

## 9.6 Entitlements

The website and extension must share a common entitlement contract.

A lightweight licensing backend should:

- Verify purchases.
- Validate premium access.
- Synchronize entitlement status.
- Support purchase restoration.
- Handle expiration where applicable.

File processing must never require the licensing backend.

---

# 10. Privacy and Security Requirements

Local-first processing is a fundamental product requirement.

## 10.1 File privacy

- Original images must never be uploaded for processing.
- Intermediate image buffers remain local.
- Output files remain local.
- Batch files must not be transmitted to backend services.
- File contents must not be included in analytics.

## 10.2 Data collection

Permitted minimal information may include:

- Purchase and entitlement data.
- Anonymous feature usage events.
- Performance and error telemetry.

Users must be informed about applicable telemetry.

## 10.3 Security

- Validate input file types.
- Validate actual file signatures where practical.
- Avoid trusting filenames or MIME types alone.
- Handle malformed image files safely.
- Sanitize filenames for ZIP export.
- Handle SVG carefully if introduced.
- Release object URLs and temporary resources.
- Avoid unnecessary third-party processing services.

The privacy policy must accurately describe the actual implementation.

---

# 11. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Responsive UI during processing |
| Privacy | Local image processing |
| Reliability | Per-file error isolation |
| Accuracy | Exact output dimensions |
| Precision | Validate target file size |
| Compatibility | Supported modern browsers |
| Scalability | Bounded batch concurrency |
| Accessibility | Keyboard-accessible controls |
| Maintainability | Shared image engine |
| Security | Safe input handling |
| Memory | Explicit cleanup and resource limits |

## Performance principles

- Avoid unnecessary image copies.
- Avoid decoding the same source repeatedly.
- Use workers.
- Limit simultaneous processing jobs.
- Lazy-load heavy processing modules.
- Provide progress states.
- Handle browser memory limits gracefully.

Do not promise a universal maximum file size or processing time before benchmarking on representative devices.

---

# 12. Error Handling

The application must handle:

- Unsupported formats.
- Corrupted images.
- Invalid dimensions.
- Invalid file-size targets.
- Browser encoder limitations.
- Memory exhaustion.
- Worker failures.
- ZIP generation errors.
- Download failures.
- Target file size not achieved.

Each error must provide a useful explanation and, where possible, an actionable recovery.

One image failing in a batch must not stop other images from processing.

---

# 13. Analytics and Success Metrics

## 13.1 Product events

Suggested events:

- `optimizer_opened`
- `files_selected`
- `image_decoded`
- `processing_started`
- `processing_completed`
- `processing_failed`
- `format_changed`
- `aspect_ratio_changed`
- `fit_mode_changed`
- `target_size_set`
- `target_size_achieved`
- `target_size_failed`
- `batch_started`
- `batch_completed`
- `marketplace_preset_selected`
- `marketplace_compliance_passed`
- `marketplace_compliance_failed`
- `zip_downloaded`
- `premium_prompt_shown`
- `checkout_started`
- `purchase_completed`

Never include filenames, image contents or sensitive image metadata in analytics.

## 13.2 Success metrics

### Activation

- Visitor-to-first-processing conversion.
- Percentage of users who successfully download an optimized image.
- Time to first successful output.

### Engagement

- Images processed per session.
- Percentage of users using batch processing.
- Repeat sessions.
- Day 7 and Day 30 retention.

### Product quality

- Processing success rate.
- Target-size achievement rate.
- Average file-size reduction.
- Processing duration.
- Batch completion rate.
- Error rate by format.

### Monetization

- Premium feature engagement.
- Upgrade prompt conversion.
- Checkout completion.
- Paid conversion rate.
- Revenue per active user.

---

# 14. MVP Acceptance Criteria

The MVP is ready for launch only when all P0 requirements pass.

## Format conversion

- [ ] JPEG input works.
- [ ] PNG input works.
- [ ] WebP input works.
- [ ] JPEG output works.
- [ ] PNG output works.
- [ ] WebP output works.
- [ ] Transparency is handled correctly.
- [ ] Invalid inputs produce useful errors.

## Target file size

- [ ] User can enter a maximum file size.
- [ ] Unit conversion works.
- [ ] Automatic optimization works for lossy formats.
- [ ] PNG optimization uses an appropriate strategy.
- [ ] Actual output size is measured.
- [ ] Target achievement is explicitly validated.
- [ ] Impossible targets are reported honestly.

## Aspect ratio

- [ ] Preset aspect ratios work.
- [ ] Custom aspect ratios work.
- [ ] Crop-to-fill works.
- [ ] Contain-with-background works.
- [ ] Manual crop positioning works.
- [ ] Automatic background matching works.
- [ ] Manual background selection works.

## Dimensions

- [ ] Exact width and height are supported.
- [ ] Aspect-ratio locking works.
- [ ] Independent dimensions work.
- [ ] Output dimensions are verified.

## Batch processing

- [ ] Multiple files can be selected.
- [ ] Shared settings apply to all images.
- [ ] Per-image overrides work.
- [ ] Processing status is shown per image.
- [ ] Individual downloads work.
- [ ] ZIP export works.
- [ ] Failed images can be retried.
- [ ] Processing concurrency is bounded.

## Marketplace compliance (Amazon only)

- [ ] Amazon preset pre-fills format, longest-side dimension range and white background.
- [ ] User can override any pre-filled value.
- [ ] Output is validated against format, longest-side range, dpi and exact-white background.
- [ ] Product-fill heuristic shown as advisory only, never a pass/fail gate.
- [ ] Non-automatable rules (mannequins, model pose, props, logos, etc.) shown as a manual checklist, never labeled "compliant."
- [ ] Preset works in batch mode with per-image override.
- [ ] Preset's source URL and last-verified date are visible wherever its rules are shown.

## Pipeline

- [ ] All transformations use the shared engine.
- [ ] Original files remain unchanged.
- [ ] Transformations execute in the documented order.
- [ ] Output validation runs before download.
- [ ] Temporary resources are released.
- [ ] Website and extension use the same engine.

## Privacy

- [ ] No image uploads occur.
- [ ] No image content reaches analytics.
- [ ] Privacy documentation is accurate.
- [ ] Extension permissions are minimal.

---

# 15. Development Roadmap

The AI coding agent should implement this product incrementally.

## Milestone 1 — Project Foundation

- Initialize pnpm monorepo.
- Configure TypeScript.
- Set up React and Vite.
- Create website and extension applications.
- Create shared packages.
- Define common domain types.
- Configure linting, formatting and tests.

**Deliverable:** A running monorepo with working application shells.

## Milestone 2 — Image Engine Foundation

- Implement format detection.
- Implement decoding.
- Implement orientation normalization.
- Implement output encoding.
- Implement image metadata inspection.
- Add basic validation.

**Deliverable:** Working image conversion engine.

## Milestone 3 — Transformation Engine

- Implement crop-to-fill.
- Implement contain-with-background.
- Implement automatic background matching.
- Implement custom crop positioning.
- Implement exact resizing.
- Add aspect-ratio presets.
- Add marketplace compliance preset data model.

**Deliverable:** Complete image geometry transformation pipeline.

## Milestone 4 — Target File Size Engine

- Implement lossy quality optimization.
- Implement PNG optimization.
- Add bounded iterative search.
- Add target-size validation.
- Add impossible-target handling.
- Add quality and performance benchmarks.

**Deliverable:** Reliable target-size optimization.

## Milestone 5 — Batch Engine

- Implement batch job management.
- Add bounded concurrency.
- Add progress reporting.
- Add per-image errors.
- Add individual overrides.
- Add ZIP export.
- Add cancellation where supported.

**Deliverable:** Batch processing using the same image pipeline.

## Milestone 6 — Website Experience

- Build homepage.
- Build unified optimizer interface.
- Integrate shared image engine.
- Implement previews.
- Implement batch interface.
- Implement downloads.
- Add responsive and accessible UI.
- Add marketplace preset selector and compliance validation UI.

**Deliverable:** Fully working website.

## Milestone 7 — Chrome Extension

- Implement Manifest V3.
- Build popup.
- Integrate shared engine.
- Implement local image selection.
- Implement downloads.
- Add entitlement integration.

**Deliverable:** Working Chrome extension.

## Milestone 8 — Monetization and Launch

- Implement checkout.
- Implement licensing API.
- Add entitlement verification.
- Verify privacy claims.
- Run browser compatibility tests.
- Run performance benchmarks.
- Publish website.
- Submit extension for review.

**Deliverable:** Production-ready ShrinkLab MVP.

---

# 16. AI Coding Agent Instructions

This section is mandatory guidance for any AI agent implementing ShrinkLab.

## 16.1 Source of truth

This PRD is the primary source of truth for product behavior.

Do not invent additional product features or expand scope without explicit approval.

If a technical detail is unspecified, choose a conservative, maintainable implementation and document the decision.

## 16.2 Architecture discipline

- Maintain clear package boundaries.
- Keep image processing independent from React.
- Keep UI state separate from processing state.
- Reuse the same image engine in website and extension.
- Use TypeScript types for all major domain contracts.
- Avoid unnecessary dependencies.
- Avoid premature abstractions.
- Do not duplicate image transformation logic.

## 16.3 Implementation discipline

- Work milestone by milestone.
- Do not implement the entire product in one uncontrolled change.
- Define acceptance criteria for each task.
- Write tests alongside implementation.
- Verify actual output dimensions and file sizes.
- Test transparent images.
- Test landscape, portrait and square images.
- Test large images and malformed files.
- Test batch failures.
- Document browser-specific limitations.

## 16.4 Important engineering rules

1. Never mutate the original source image.
2. Never claim a target file size has been achieved without checking the actual output.
3. Never silently change requested output dimensions.
4. Never silently substitute an unsupported output format.
5. Never allow one failed batch item to crash the whole batch.
6. Never process an unlimited number of large images concurrently.
7. Never make the UI dependent on the processing implementation.
8. Never upload user images to a backend.
9. Never introduce a new feature without checking the product scope.
10. Always validate the final output before making it downloadable.

## 16.5 Testing requirements

Use:

- Unit tests for transformation logic.
- Integration tests for the processing pipeline.
- Browser tests for UI workflows.
- Representative real-image fixtures.
- Batch-processing tests.
- Output validation tests.

Maintain a test fixture set containing:

- Small JPEG.
- Large JPEG.
- Transparent PNG.
- Large PNG.
- WebP.
- Portrait photograph.
- Landscape photograph.
- Square image.
- Image with EXIF orientation.
- Malformed image.
- Image with unusually large dimensions.

Test exact output dimensions, target-size behavior, transparency, background filling and crop positioning.

## 16.6 Required documentation

Maintain:

- README.
- Architecture document.
- Package responsibilities.
- Environment configuration.
- Development instructions.
- Test instructions.
- Supported-format matrix.
- Known browser limitations.
- Processing algorithm documentation.
- Decision log for major technical choices.

## 16.7 Definition of Done

A feature is complete only when:

- Implementation is finished.
- Tests pass.
- Acceptance criteria are met.
- Errors are handled.
- Documentation is updated.
- No unrelated scope has been introduced.

---

# 17. Product Decisions Register

The following decisions are established for the MVP.

| Decision | Status |
|---|---|
| Image-only product | Final |
| Product identity: Image Optimizer | Final |
| Format conversion | Required |
| Target file size | Required |
| Crop-to-fill | Required |
| Contain-with-background | Required |
| Automatic background matching | Required |
| Exact output dimensions | Required |
| Batch processing | Required |
| Marketplace compliance presets | Required |
| Unified image pipeline | Required |
| Before/after preview | Required |
| Website + Chrome extension | Required |
| Local-first processing | Required |
| Free basic compression | Final |
| Contextual premium monetization | Final |
| PDF processing | Excluded |
| General-purpose image editing | Excluded |
| AI image generation | Excluded |

## 18. Final Product Definition

ShrinkLab is a local-first image optimization suite that converts, crops, resizes and compresses individual images or entire batches according to user-defined output specifications.

Its central differentiator is a unified pipeline that allows users to specify:

- What format they need.
- What aspect ratio they need.
- Whether to crop or contain the image.
- What background color to use.
- What exact dimensions they need.
- What maximum file size they need.

ShrinkLab handles the transformations and validates the final result.

**The product is successful when users can take a collection of images, specify their desired output requirements once, and reliably receive images ready for their intended use — without needing multiple tools or uploading their files to a server.**