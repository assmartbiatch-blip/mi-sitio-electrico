// ============================================
// MÓDULO DE DIBUJOS INTERACTIVOS
// ============================================

const Dibujos = {
    // Dibujar cable para caída de tensión
    dibujarCableCaida: function(seccion, longitud, material) {
        const canvas = document.getElementById('canvas-cable');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configuración del dibujo
        const centroY = canvas.height / 2;
        const inicioX = 50;
        const finX = canvas.width - 50;
        
        // Calcular grosor del cable basado en sección (escala logarítmica para mejor visualización)
        const grosorBase = 30;
        const grosor = Math.min(80, grosorBase + Math.log10(seccion) * 15);
        
        // Colores según material
        const colorCable = material === 'cobre' ? '#B87333' : '#C0C0C0';
        const colorAislante = material === 'cobre' ? 'rgba(184, 115, 51, 0.3)' : 'rgba(192, 192, 192, 0.3)';
        
        // Dibujar cable de ida (superior)
        ctx.beginPath();
        ctx.moveTo(inicioX, centroY - 40);
        ctx.lineTo(finX, centroY - 40);
        ctx.lineWidth = grosor / 3;
        ctx.strokeStyle = colorCable;
        ctx.stroke();
        
        // Dibujar aislamiento cable ida
        ctx.beginPath();
        ctx.moveTo(inicioX, centroY - 40 - 10);
        ctx.lineTo(finX, centroY - 40 - 10);
        ctx.lineWidth = grosor / 2;
        ctx.strokeStyle = colorAislante;
        ctx.stroke();
        
        // Dibujar cable de vuelta (inferior)
        ctx.beginPath();
        ctx.moveTo(inicioX, centroY + 40);
        ctx.lineTo(finX, centroY + 40);
        ctx.lineWidth = grosor / 3;
        ctx.strokeStyle = colorCable;
        ctx.stroke();
        
        // Dibujar aislamiento cable vuelta
        ctx.beginPath();
        ctx.moveTo(inicioX, centroY + 40 + 10);
        ctx.lineTo(finX, centroY + 40 + 10);
        ctx.lineWidth = grosor / 2;
        ctx.strokeStyle = colorAislante;
        ctx.stroke();
        
        // Dibujar fuente (generador)
        ctx.fillStyle = '#FF8A5C';
        ctx.beginPath();
        ctx.arc(30, centroY, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G', 30, centroY);
        
        // Dibujar carga (motor)
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(canvas.width - 30, centroY, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4A4A4A';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('M', canvas.width - 30, centroY);
        
        // Dibujar líneas de corriente y voltaje
        ctx.font = '12px Arial';
        ctx.fillStyle = '#4A4A4A';
        
        // Mostrar corriente
        ctx.fillText(`I = ${document.getElementById('caida_corriente')?.value || '50'} A`, canvas.width / 2, centroY - 70);
        
        // Mostrar longitud
        ctx.fillText(`L = ${longitud} m`, canvas.width / 2, centroY + 80);
        
        // Dibujar resistencia distribuida
        for (let i = inicioX + 50; i < finX - 50; i += 60) {
            ctx.fillStyle = '#FF8A5C';
            ctx.beginPath();
            ctx.arc(i, centroY - 40, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(i, centroY + 40, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // Dibujar triángulo de potencias
    dibujarTrianguloPotencias: function(P, Q, S, fp) {
        const canvas = document.getElementById('canvas-triangulo');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centroX = canvas.width / 2;
        const centroY = canvas.height / 2;
        const escala = 0.5;
        
        // Escalar valores para visualización
        const pLength = Math.min(150, P * escala);
        const qLength = Math.min(150, Q * escala);
        
        // Dibujar ejes
        ctx.beginPath();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.moveTo(50, centroY);
        ctx.lineTo(canvas.width - 50, centroY);
        ctx.moveTo(centroX, 30);
        ctx.lineTo(centroX, canvas.height - 30);
        ctx.stroke();
        
        // Dibujar triángulo
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.lineTo(centroX + pLength, centroY);
        ctx.lineTo(centroX, centroY - qLength);
        ctx.closePath();
        
        // Rellenar con colores
        ctx.fillStyle = 'rgba(255, 138, 92, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#FF8A5C';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Etiquetas
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#4A4A4A';
        ctx.fillText('P', centroX + pLength/2, centroY - 10);
        ctx.fillText('Q', centroX - 30, centroY - qLength/2);
        
        // Hipotenusa (S)
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#FF8A5C';
        ctx.fillText(`S = ${S.toFixed(1)} kVA`, centroX + pLength/2, centroY - qLength/2 - 10);
        
        // Ángulo
        ctx.beginPath();
        ctx.arc(centroX, centroY, 40, 0, Math.acos(fp));
        ctx.strokeStyle = '#2C3E50';
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Factor de potencia
        ctx.fillStyle = '#2C3E50';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`φ = ${Math.acos(fp) * 180 / Math.PI}°`, centroX + 50, centroY - 50);
    }
};