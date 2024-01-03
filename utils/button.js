// 带有描边的按钮公共方法
export function drawRoundedRect(context, x, y, width, height, radius, fillColor, strokeColor, strokeWidth) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  // 填充
  context.fillStyle = fillColor;
  context.fill();
  // 描边
  if (strokeColor && strokeWidth) {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.stroke();
  }
}

// 图片返回按钮的公共方法
export function createBackButton(context, x, y, imagePath, callback) {
  const image = new Image();
  image.src = imagePath;
  const button = { x, y, width: 0, height: 0, image, onClick: callback };

  image.onload = () => {
    button.width = image.width;
    button.height = image.height;
    context.drawImage(image, x, y);
  };

  return button;
}