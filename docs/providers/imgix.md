# imgix Provider

## Usage

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider "path/to/image.jpg"}}/>
```

### Custom parameters

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [imgix parameters](https://docs.imgix.com/apis/rendering) by passing a `params` hash:

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider "path/to/image.jpg" params=(hash monochrome="44768B" px=10)}}/>
```


### Image formats

By default, all image formats supported by imgix (PNG, JPEG, WEBP, but no AVIF yet) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider "path/to/image.jpg" formats=(array "webp" "jpeg")}}/>
```

