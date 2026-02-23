// ============================================
// SIMULADORES Y GRÁFICAS
// ============================================

let chart = null;

// Función para actualizar la gráfica de arranque
function actualizarGrafica() {
    const potencia = parseFloat(document.getElementById('sim-potencia').value);
    const tipo = document.getElementById('sim-tipo').value;
    
    document.getElementById('potencia-val').textContent = potencia;
    
    // Calcular corriente nominal aproximada (asumiendo 400V, fp 0.85)
    const In = (potencia * 1000) / (Math.sqrt(3) * 400 * 0.85);
    
    // Generar curva según tipo
    let corrientes = [];
    let labels = [];
    
    for (let t = 0; t <= 10; t += 0.5) {
        labels.push(t.toFixed(1) + 's');
        let I;
        
        switch(tipo) {
            case 'dol':
                // Pico inicial luego estabilización
                I = t < 0.5 ? In * 8 : In * (1 + 0.5 * Math.exp(-t));
                break;
            case 'et':
                // Transición estrella-triángulo
                if (t < 3) I = In * 2.5;
                else if (t < 4) I = In * 4;
                else I = In;
                break;
            case 'soft':
                // Rampa suave
                I = In * (2 + 2 * Math.exp(-t));
                break;
            case 'vfd':
                // Control total
                I = In * (1.2 + 0.3 * Math.exp(-t));
                break;
        }
        
        corrientes.push(I);
    }
    
    // Actualizar gráfica
    if (chart) {
        chart.destroy();
    }
    
    const ctx = document.getElementById('grafica-arranque').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Corriente (A)',
                data: corrientes,
                borderColor: '#FF8A5C',
                backgroundColor: 'rgba(255, 138, 92, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Curva de corriente durante el arranque'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Corriente (A)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                }
            }
        }
    });
}

// Event listeners para el simulador
document.addEventListener('DOMContentLoaded', function() {
    const simPotencia = document.getElementById('sim-potencia');
    const simTipo = document.getElementById('sim-tipo');
    
    if (simPotencia) {
        simPotencia.addEventListener('input', actualizarGrafica);
    }
    if (simTipo) {
        simTipo.addEventListener('change', actualizarGrafica);
    }
});

// Función para comparar métodos de arranque
function compararArranques(potencia_kW) {
    const metodos = ['dol', 'et', 'soft', 'vfd'];
    const nombres = {
        dol: 'Directo',
        et: 'Estrella-Triángulo',
        soft: 'Soft Starter',
        vfd: 'Variador'
    };
    
    const In = (potencia_kW * 1000) / (Math.sqrt(3) * 400 * 0.85);
    
    let resultados = [];
    for (let metodo of metodos) {
        let I_arranque = calcularCorrienteArranque(In, metodo);
        let I_arranque_pu = I_arranque / In;
        
        resultados.push({
            metodo: nombres[metodo],
            corriente_arranque: I_arranque.toFixed(0) + ' A',
            relacion: I_arranque_pu.toFixed(1) + ' × In',
            ventajas: obtenerVentajas(metodo)
        });
    }
    
    return resultados;
}

function obtenerVentajas(metodo) {
    const ventajas = {
        dol: '⚡ Simplicidad, bajo costo',
        et: '💰 Reduce corriente de arranque',
        soft: '🎚️ Arranque suave ajustable',
        vfd: '📊 Control total de velocidad'
    };
    return ventajas[metodo];
}