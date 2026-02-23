// ============================================
// CALCULADORAS ELÉCTRICAS
// ============================================

// Calculadora de corriente trifásica
function calcularCorrienteTrifasica(P_kW, V, fp, eficiencia) {
    const P_W = P_kW * 1000;
    const eficiencia_decimal = eficiencia / 100;
    return P_W / (Math.sqrt(3) * V * fp * eficiencia_decimal);
}

// Calculadora de potencia trifásica
function calcularPotenciaTrifasica(I, V, fp, eficiencia) {
    const eficiencia_decimal = eficiencia / 100;
    return (Math.sqrt(3) * V * I * fp * eficiencia_decimal) / 1000; // en kW
}

// Calculadora de caída de tensión
function calcularCaidaTension(longitud, I, seccion, material = 'cobre') {
    // Constantes de resistividad
    const resistividad = {
        cobre: 0.0172,
        aluminio: 0.0282
    };
    
    const rho = resistividad[material];
    const R = (2 * rho * longitud) / seccion; // resistencia total ida+vuelta
    const caida = I * R; // caída en voltios
    
    return caida;
}

// Calculadora de corrección de factor de potencia
function calcularCondensador(P_kW, fp_actual, fp_deseado, V, frecuencia = 60) {
    const P_W = P_kW * 1000;
    const Qc = P_W * (Math.tan(Math.acos(fp_actual)) - Math.tan(Math.acos(fp_deseado)));
    const C = Qc / (2 * Math.PI * frecuencia * Math.pow(V, 2));
    
    return {
        potencia_reactiva: Qc / 1000, // kVAR
        capacitancia: C * 1000000 // μF
    };
}

// Calculadora de corriente de arranque según método
function calcularCorrienteArranque(In, metodo) {
    const factores = {
        dol: 7.5,      // 6-8 veces In
        et: 2.5,       // 30-40% de DOL
        soft: 3.5,     // 3-4 veces In
        vfd: 1.5       // 1.5 veces In
    };
    
    return In * factores[metodo];
}

// Calculadora de sección de cable por corriente
function seleccionarSeccionCable(I, material = 'cobre', aislamiento = 'PVC', instalacion = 'B1') {
    // Tabla simplificada (NEC/CEN)
    const tabla = {
        cobre: {
            '1.5': 15,
            '2.5': 21,
            '4': 28,
            '6': 36,
            '10': 50,
            '16': 68,
            '25': 89,
            '35': 110,
            '50': 134
        }
    };
    
    let seccion_recomendada = null;
    for (let [seccion, capacidad] of Object.entries(tabla[material])) {
        if (capacidad >= I * 1.25) { // 25% de margen
            seccion_recomendada = seccion;
            break;
        }
    }
    
    return seccion_recomendada;
}

// Formatear número
function formatearNumero(num, decimales = 2) {
    return num.toFixed(decimales).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}