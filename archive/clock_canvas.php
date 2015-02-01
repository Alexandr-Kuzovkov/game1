<!DOCTYPE html>
<html>
<head>
</head>
<body>
<canvas width="150" height="150" id="canvas"></canvas>
<script type="text/javascript">
// ������� ��������
window.onload = function(){
	  // ������ ����
	  clock();
	  // ����� ������ �������
	  // ���� ����������������
	  setInterval(clock, 1000);
	  }
	//
	function clock() {
 // �������� ������� ���� � �����
	  var now = new Date();
	  var sec = now.getSeconds();
	  var min = now.getMinutes();
	  var hr = now.getHours();
	 
	  // �������� �������� canvas
	  var ctx = document
	  .getElementById("canvas")
	 .getContext("2d");
	 
	  // ��������� ���������
	  ctx.save();
	  // �������������� �����
	  ctx.clearRect(0,0,150,150);
	  // ����� � ����� 0,0 ����������
	  // ������ � ����� 75,75
  ctx.translate(75,75);
	  // ��� ��������� ����� � 100px
	  // ���������� ������ ����� � 40px
	  ctx.scale(0.4,0.4);
	  // �������� ������� � 12:00
	  ctx.rotate(-Math.PI/2);
	 
	  // �������������� �������� �������
	  // ������� ������ ������
	  ctx.strokeStyle = "black";
	  // ������� ���� ������
	  ctx.fillStyle = "black";
	  // ������ ����� 8px
	  ctx.lineWidth = 8;
	  // ����� �������� �� �����
	  ctx.lineCap = "round";
	 
	  // �������� �������� ������� �����
	  // ��������� ���������� ���������
	  ctx.save();
	  ctx.beginPath();
	  // ��� ������� ����
	  for(var i = 0; i < 12; i++) {
	    // ������������ �� 1/12
	    ctx.rotate(Math.PI/6);
	    // ���������� ������
	    ctx.moveTo(100,0);
	    // ������ �������� 20px
	    ctx.lineTo(120,0);
	  }
	  ctx.stroke();
	  ctx.restore();
	 
	  // ��������� ���������
	  ctx.save();
	  // ������ ������ ����� 5px
	  ctx.lineWidth = 5;
	  ctx.beginPath();
	  // ������ �������� �����
	  // ��� ������ ������
	  for(var i = 0; i < 60; i++) {
	    // ����� ���, ��� ��������
	    // � ������
	    if(i%5 != 0) {
	      // ���������� ������
	      ctx.moveTo(117,0);
	      // ������ �������� 3px
	      ctx.lineTo(120,0);
	    }
	    // ������� ����� �� 1/60
	    ctx.rotate(Math.PI/30);
	  }
	  ctx.stroke();
	  ctx.restore();
	 
	  // ��������� ���������
	  ctx.save();
	  // �������� �������� ������� �������
	  // ������� ����� �� ������� �������
	  ctx.rotate((Math.PI/6)*hr +
	             (Math.PI/360)*min +
	             (Math.PI/21600)*sec);
	  // ������������� ������ ����� 14px
	  ctx.lineWidth = 14;
	 
	  ctx.beginPath();
	  // �������� ������ ��������� �����
	  // ����� ���� ������ �� �������
	  ctx.moveTo(-20,0);
	  // ������ ����� ����� �� ������� �����
	  ctx.lineTo(80,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // ��������� ���������
	  ctx.save();
	  // �������� �������� �������� �������
	  // ������� ����� �� ������� �������
	  ctx.rotate((Math.PI/30)*min +
	             (Math.PI/1800)*sec);
	  // ������ ����� 10px
	  ctx.lineWidth = 10;
	  ctx.beginPath();
	  // ������� ������
	  ctx.moveTo(-28,0);
	  // ������ �����
	  ctx.lineTo(112,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // ��������� ���������
	  ctx.save();
	  // �������� �������� ��������� �������
	  // ������� ����� �� ������� �������
	  ctx.rotate(sec * Math.PI/30);
	  // ������ � ������� �������� �����
  ctx.strokeStyle = "#D40000";
	  ctx.fillStyle = "#D40000";
	  // ������ ����� 6px
	  ctx.lineWidth = 6;
	  ctx.beginPath();
	  // ������� ������
	  ctx.moveTo(-30,0);
	  // ������ �����
	  ctx.lineTo(83,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // ��������� ���������
	  ctx.save();
	  // ������ ������� ����������
	  // ������� 14px
	  ctx.lineWidth = 14;
	  // ����� ������
	  ctx.strokeStyle = "#325FA2";
	  ctx.beginPath();
	  // ������ ����������, �����������
	  // �� ������ �� 142px
	  ctx.arc(0,0,142,0,Math.PI*2,true);
	  ctx.stroke();
	  ctx.restore();
	 
	  ctx.restore();
	}
</script>
</body>
</html>