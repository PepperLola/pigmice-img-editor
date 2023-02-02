# Pigmice Image Editor

This website can be used to create 16x16 pixel images to display on an LED panel.

## Usage

### Tools

**Pen** - draw as normal, by clicking and dragging the mouse  
**Eraser** - erase what has been drawn  
**Paint Bucket** - fill an area with a color  
**Line** - draw a line between two points  
**Square** - draw a square between two points  
**Ellipse** - draws an ellipse between two points _(a bit buggy)_
**Eyedropper** - click to grab a color from the canvas and store to current colors  
**Clear** - hold for 1 second to clear the canvas

### Colors

The color bar is located directly beneath the canvas. Click on a color to save it as your primary color on the right. Hold shift while clicking to save it as your secondary color.  
Primary and secondary colors can be located on the right, with the primary color being displayed on top of the secondary color. Click the left-right arrow icon to switch primary and secondary colors.

### Exporting

Click <kbd>Export</kbd> above the canvas to start exporting the image. Enter a name for the image when prompted _(preferably in all caps as this adheres to the general Java final variable style)_. The 2D `byte[][]` will be copied to your clipboard.  
To add the image to the robot program, paste it into wherever the robot images are stored. For the Pigmice 2023 robot, this can be found [here](https://github.com/Pigmice2733/frc-2023/blob/lights/src/main/java/frc/robot/lights/Images.java), and can then be displayed using `lights.displayImage(Images.<name>, x, y)`.
