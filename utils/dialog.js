// 带有描边的提示框
export function drawDialog(context, text, options = {}) {
  const {
    width = 200, height = 100, backgroundColor = '#f5d659', borderColor = 'black', borderWidth = 3, textColor = 'black', fontSize = '16px', fontFamily = 'Arial'
  } = options;
  const canvasWidth = context.canvas.width / devicePixelRatio;
  const canvasHeight = context.canvas.height / devicePixelRatio;
  const dialogX = (canvasWidth - width) / 2;
  const dialogY = (canvasHeight - height) / 2;
  // 绘制背景
  context.fillStyle = backgroundColor;
  context.strokeStyle = borderColor;
  context.lineWidth = borderWidth;
  context.fillRect(dialogX, dialogY, width, height);
  context.strokeRect(dialogX, dialogY, width, height);
  // 绘制文本
  context.fillStyle = textColor;
  context.font = `${fontSize} ${fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvasWidth / 2, canvasHeight / 2);
  // 绘制关闭按钮
  const closeButtonSize = 20; // 关闭按钮的尺寸
  const closeButtonX = dialogX + width - closeButtonSize;
  const closeButtonY = dialogY;
  context.fillStyle = 'bold black'; // 设置关闭按钮的颜色
  context.font = `${closeButtonSize}px Arial`; // 设置关闭按钮的字体大小
  context.fillText('X', closeButtonX, closeButtonY + closeButtonSize);

  // 返回关闭按钮的坐标和尺寸信息，用于点击检测
  return {
    closeButtonX,
    closeButtonY,
    closeButtonSize
  };
}