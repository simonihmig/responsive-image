---
"@responsive-image/build-utils": major
"@responsive-image/vite-plugin": major
"@responsive-image/webpack": major
---

Update dependency imagetools-core to v9

imagetools-core v8 introduced a breaking change by adding a `autoOrient` directove that is enabled by default (automatically fix the orientation based on EXIF data), which applies to all images processed by the vite or webpack plugins here as well. 
