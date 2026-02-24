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

<!-- Calculadora de Caída de Tensión MEJORADA -->
<div class="calculadora-card" style="margin-bottom: 30px;">
    <h3>📏 Caída de Tensión <span style="font-size: 0.9rem; background: #FF8A5C; color: white; padding: 3px 10px; border-radius: 50px; margin-left: 10px;">CON DIBUJO INTERACTIVO</span></h3>
    
    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
        <!-- Columna izquierda: Controles -->
        <div>
            <div class="input-group">
                <label>📏 Longitud del cable (m):</label>
                <input type="number" id="caida_longitud" value="50" min="1" max="1000" step="1">
                <small style="color: #666;">Distancia desde la fuente hasta la carga</small>
            </div>
            
            <div class="input-group">
                <label>⚡ Corriente (A):</label>
                <input type="number" id="caida_corriente" value="50" min="1" max="500" step="1">
            </div>
            
            <div class="input-group">
                <label>📐 Sección (mm²):</label>
                <input type="number" id="caida_seccion" value="10" min="1.5" max="120" step="0.5">
                <small style="color: #666;">Sección transversal del conductor</small>
            </div>
            
            <div class="input-group">
                <label>🧵 Material:</label>
                <select id="caida_material">
                    <option value="cobre">Cobre (ρ = 0.0172 Ω·mm²/m)</option>
                    <option value="aluminio">Aluminio (ρ = 0.0282 Ω·mm²/m)</option>
                </select>
            </div>
            
            <div class="input-group">
                <label>🔌 Tensión (V):</label>
                <input type="number" id="caida_tension" value="400" min="12" max="13800" step="10">
            </div>
            
            <button onclick="calcularCaidaMejorada()">Calcular caída</button>
        </div>
        
        <!-- Columna derecha: Visualización y resultados -->
        <div>
            <!-- Canvas para el dibujo del cable -->
            <canvas id="canvas-cable" width="400" height="200" style="width: 100%; height: auto; background: #f9f9f9; border-radius: 15px; border: 2px solid #FFD1DC; margin-bottom: 15px;"></canvas>
            
            <div style="background: var(--gris-claro); padding: 20px; border-radius: 15px;">
                <h4 style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span>📊 Resultados</span>
                    <span id="caida_estado" style="font-size: 0.8rem; padding: 3px 10px; border-radius: 50px;"></span>
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: white; padding: 10px; border-radius: 10px; text-align: center;">
                        <small style="color: #666;">Caída (V)</small>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #FF8A5C;" id="caida_v">--</div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 10px; text-align: center;">
                        <small style="color: #666;">Porcentaje</small>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #FF8A5C;" id="caida_p">--</div>
                    </div>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 10px; margin-top: 15px;" id="caida_detalle">
                    <p style="margin-bottom: 5px;"><strong>Resistencia total:</strong> <span id="caida_r">--</span> Ω</p>
                    <p><strong>Potencia perdida:</strong> <span id="caida_perdida">--</span> W</p>
                </div>
                
                <div id="caida_recomendacion" style="margin-top: 15px; padding: 10px; border-radius: 10px; font-weight: 500;"></div>
            </div>
        </div>
    </div>
    
    <!-- Sección de explicación educativa (colapsable) -->
    <div style="margin-top: 20px; border-top: 2px dashed #FFD1DC; padding-top: 15px;">
        <details>
            <summary style="cursor: pointer; color: #FF8A5C; font-weight: 600; list-style: none;">
                📘 Ver explicación paso a paso de cómo se calcula
            </summary>
            <div style="margin-top: 15px; background: #FFF3E0; padding: 20px; border-radius: 15px;">
                <h4>Fórmula utilizada:</h4>
                <div style="background: white; padding: 15px; border-radius: 10px; font-size: 1.2rem; text-align: center; margin: 15px 0;">
                    ΔV = 2 × ρ × L × I / S
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                    <div><small>ρ = Resistividad</small><br><strong>0.0172 (Cu)</strong></div>
                    <div><small>L = Longitud</small><br><strong id="explicacion_l">50 m</strong></div>
                    <div><small>I = Corriente</small><br><strong id="explicacion_i">50 A</strong></div>
                    <div><small>S = Sección</small><br><strong id="explicacion_s">10 mm²</strong></div>
                </div>
                
                <p style="margin-top: 15px;"><strong>Paso a paso:</strong></p>
                <ol style="margin-left: 20px;">
                    <li id="paso1">Calculamos la resistencia del conductor: R = ρ × L / S</li>
                    <li id="paso2">Multiplicamos por 2 (ida y vuelta): R_total = 2 × R</li>
                    <li id="paso3">Aplicamos Ley de Ohm: ΔV = I × R_total</li>
                    <li id="paso4">Calculamos porcentaje: (ΔV / V) × 100%</li>
                </ol>
                
                <div style="background: #FF8A5C; color: white; padding: 10px; border-radius: 10px; margin-top: 15px;">
                    <strong>💡 Dato importante:</strong> La norma IEC 60364 recomienda caída de tensión máxima del 3% para circuitos de fuerza.
                </div>
            </div>
        </details>
    </div>
</div>

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