# imgix Provider

## Usage

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider "path/to/image.jpg"}}/>
```

### Image formats

By default, all image formats supported by imgix (PNG, JPEG, WEBP, but no AVIF yet) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider "path/to/image.jpg" formats=(array "webp" "jpeg")}}/>
```

