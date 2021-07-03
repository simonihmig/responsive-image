# Cloudinary Provider

## Usage

```hbs
<ResponsiveImage @src={{responsive-image-cloudinary-provider "path/to/uploaded/image.jpg"}}/>
```

### Transformations

Besides the transformations that the adodn itself implicitly adds (related to resizing images)
you can add your own [Cloudinary transformations](https://cloudinary.com/documentation/transformation_reference) by using the
`transformations` parameter:

```hbs
<ResponsiveImage @src={{responsive-image-cloudinary-provider "path/to/uploaded/image.jpg" transformations="e_sharpen:400,e_grayscale"}}/>
```
