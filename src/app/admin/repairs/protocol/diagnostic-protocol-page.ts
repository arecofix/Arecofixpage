import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DiagnosticNode {
  id: string;
  question?: string;
  solutionTitle?: string;
  solutionSteps?: string[];
  options?: { text: string; nextId: string; icon?: string; colorClass?: string }[];
}

// A simple initial knowledge base for cellphone repairs
const DIAGNOSTIC_TREE: Record<string, DiagnosticNode> = {
  start: {
    id: 'start',
    question: '¿Cuál es el problema principal que reporta el cliente o que observás en el equipo?',
    options: [
      { text: 'No enciende / No da imagen', nextId: 'power_display', icon: 'fa-power-off', colorClass: 'text-red-500 bg-red-50' },
      { text: 'Problemas de Carga', nextId: 'charging_issues', icon: 'fa-battery-empty', colorClass: 'text-orange-500 bg-orange-50' },
      { text: 'Problemas de Audio / Micrófono', nextId: 'audio_issues', icon: 'fa-volume-up', colorClass: 'text-blue-500 bg-blue-50' },
      { text: 'Fallas de Señal / WiFi', nextId: 'signal_issues', icon: 'fa-wifi', colorClass: 'text-emerald-500 bg-emerald-50' },
      { text: 'Lentitud / Reinicios / Software', nextId: 'software_issues', icon: 'fa-microchip', colorClass: 'text-purple-500 bg-purple-50' }
    ]
  },
  
  // -- Power / Display --
  power_display: {
    id: 'power_display',
    question: 'Si conectás el equipo al cargador / fuente, ¿Muestra algún síntoma (vibra, suena, enciende un LED)?',
    options: [
      { text: 'Sí, vibra o suena pero no da imagen', nextId: 'display_issue', icon: 'fa-mobile-alt' },
      { text: 'No hace nada, consumo 0.00A', nextId: 'dead_board', icon: 'fa-charging-station' },
      { text: 'Se reinicia en el logo (Bootloop)', nextId: 'bootloop', icon: 'fa-sync-alt' }
    ]
  },
  display_issue: {
    id: 'display_issue',
    solutionTitle: 'Falla en Módulo (Pantalla) o Backlight',
    solutionSteps: [
      'El hecho de que el equipo vibre y sea detectado por PC indica que la placa base probablemente esté viva.',
      '1. Abrí el equipo con cuidado y desconectá la batería.',
      '2. Revisá visualmente el conector FPC de la pantalla buscando sulfato o pines doblados.',
      '3. Conectá una pantalla de prueba (tester) sin sellar.',
      '4. Si la nueva da imagen, presupuestar cambio de módulo.',
      '5. Si la nueva NO da imagen, medir valores en la línea de Backlight/Display del FPC con el multímetro (modo diodo).'
    ]
  },
  dead_board: {
    id: 'dead_board',
    question: 'Al conectarlo a la fuente de alimentación, ¿Hay consumo antes de presionar power?',
    options: [
      { text: 'Sí, hay consumo (Corto directo)', nextId: 'short_circuit', icon: 'fa-bolt' },
      { text: 'No hay consumo antes, pero al presionar no sube (PMIC/Botón)', nextId: 'pmic_issue', icon: 'fa-microchip' },
      { text: 'Al presionar sube y se queda trabado en un consumo bajo (CPU/RAM)', nextId: 'cpu_issue', icon: 'fa-memory' }
    ]
  },
  short_circuit: {
    id: 'short_circuit',
    solutionTitle: 'Corto Circuito Directo (VPH_PWR / VBAT)',
    solutionSteps: [
      'Hay un componente en corto en la línea principal.',
      '1. Localizar inyectando voltaje (1V o 2V) y usar cámara térmica o rocín en la placa.',
      '2. Generalmente es un condensador cerámico o un diodo TVS cerca del IF PMIC o en el amplificador de señal.',
      '3. Retirar componente, verificar si el corto se fue.',
      '4. Reemplazar componente y hacer test de encendido.'
    ]
  },
  pmic_issue: {
    id: 'pmic_issue',
    solutionTitle: 'Problema en botón o PMIC',
    solutionSteps: [
      '1. Medí si hay voltaje en el flex del botón de encendido (suelen ser 1.8v o 4v según modelo).',
      '2. Si no hay voltaje, chequear la línea que va al PMIC.',
      '3. Si hay voltaje pero al puentear a tierra no enciende, el Power IC (PMIC) no está despertando. Medir entradas y salidas en las bobinas cercanas (Bucks).'
    ]
  },
  cpu_issue: {
    id: 'cpu_issue',
    solutionTitle: 'Consumo fijo bajo - Problema Digital',
    solutionSteps: [
      '1. Si al presionar power el consumo sube a 50-80mA y se queda fijo, usualmente indica que el CPU no puede leer la RAM o la memoria de almacenamiento (NAND/eMMC).',
      '2. Conectá el equipo a la PC y fijate si lo detecta como puerto EDL (Qualcomm 9008), MTK port o DFU (Apple).',
      '3. Si es así, requiere diagnóstico más avanzado de micro soldadura (Reballing de CPU/RAM o recuperación por Software avanzado).'
    ]
  },
  bootloop: {
    id: 'bootloop',
    question: '¿Cuándo comenzó el bootloop?',
    options: [
      { text: 'Después de un golpe / mojadura', nextId: 'hardware_bootloop', icon: 'fa-tint' },
      { text: 'De la nada o después de una actualización', nextId: 'software_bootloop', icon: 'fa-code' },
      { text: 'Es un iPhone y la memoria está llena', nextId: 'iphone_full_storage', icon: 'fa-apple' }
    ]
  },
  hardware_bootloop: {
    id: 'hardware_bootloop',
    solutionTitle: 'Bootloop Térmico o por Periférico',
    solutionSteps: [
      'Muchos teléfonos se reinician si detectan problemas en el bus I2C o sensores térmicos faltantes.',
      '1. Desconectá todos los flex secundarios: cámara frontal, cámara trasera, flex de carga, aurícular.',
      '2. Encendé solo con placa, batería y pantalla.',
      '3. Si enciende normal, conectá de a 1 flex hasta dar con el que genera el reinicio.',
      'En iPhones (Reinicio cada 3 min), verificar data del log "Panic Full" en 3uTools para detectar el sensor faltante (ej: flex de carga).'
    ]
  },
  software_bootloop: {
    id: 'software_bootloop',
    solutionTitle: 'Bootloop por Sistema Corrupto',
    solutionSteps: [
      '1. Entrar a modo Recovery y hacer un "Wipe Cache Partition" (no borra datos en Android).',
      '2. Si no funciona, conectar a PC y usar software oficial (SmartSwitch, iTunes, 3uTools).',
      '3. Flashear Firmware completo (Aclararle al cliente la pérdida de datos).'
    ]
  },
  iphone_full_storage: {
    id: 'iphone_full_storage',
    solutionTitle: 'iPhone en el logo por Almacenamiento Lleno',
    solutionSteps: [
      '1. Poner en Recovery Mode.',
      '2. Conectar a 3uTools o iTunes y seleccionar "Retain User\'s Data" o "Update" y flashear el firmware.',
      '3. Al reinstalar el OS sobre sí mismo, a veces limpia archivos temporales permitiendo bootear.',
      '4. Si no funciona en 3 intentos, la única forma es flashear con opción de borrado completo (Clean Flash).'
    ]
  },

  // -- Charging Issues --
  charging_issues: {
    id: 'charging_issues',
    question: 'Al conectar el cargador con medidor USB (Tester USB)...',
    options: [
      { text: 'Consume 0.00A (No detecta nada)', nextId: 'no_charge', icon: 'fa-plug' },
      { text: 'Carga lento (0.4A - 0.6A) y no pasa', nextId: 'slow_charge', icon: 'fa-hourglass-half' },
      { text: 'Muestra rayo de carga pero el % baja en vez de subir', nextId: 'fake_charge', icon: 'fa-battery-quarter' }
    ]
  },
  no_charge: {
    id: 'no_charge',
    solutionTitle: 'No detecta cargador',
    solutionSteps: [
      '1. Limpiar puerto de carga con pinzas y alcohol isopropílico (suele tener pelusa).',
      '2. Medir 5V en la salida del flex de carga para descartar que sea el PIN.',
      '3. Si hay 5V en la placa principal, revisar OVP (Chip de sobretensión) o el circuito IF PMIC.'
    ]
  },
  slow_charge: {
    id: 'slow_charge',
    solutionTitle: 'Carga Lenta / Sin Carga Rápida',
    solutionSteps: [
      '1. Limpiar o cambiar flex de carga, los pines de datos (D+ y D-) pueden estar rotos impidiendo cargar a más de 500mA.',
      '2. Si la batería fue reemplazada, probar con otra, algunas calidades genéricas impiden la carga rápida.',
      '3. En Android (ej. Samsung), la carga en pausa por temperatura indica problema en el Termistor del Flex de Carga.'
    ]
  },
  fake_charge: {
    id: 'fake_charge',
    solutionTitle: 'Falsa Carga',
    solutionSteps: [
      '1. El IC de carga detecta que hay cargador conectado y muestra el rayo, pero la energía no llega a la batería.',
      '2. Cambiar cable flex que conecta la sub-placa a la placa principal.',
      '3. Medir continuidad entre el pin positivo del conector de batería a la salida del IF PMIC.',
      '4. Puede requerir Reballing/Cambio de IC de Carga (Tristar/Hydra en iPhone; IF PMIC en Android).'
    ]
  },

  // -- Audio --
  audio_issues: {
    id: 'audio_issues',
    question: '¿Qué componente de audio está fallando?',
    options: [
      { text: 'Parlante/Altavoz (Alarma, Multimedia)', nextId: 'loudspeaker', icon: 'fa-bullhorn' },
      { text: 'Auricular de llamadas (No escucho)', nextId: 'earpiece', icon: 'fa-headphones' },
      { text: 'Micrófono (No me escuchan)', nextId: 'mic', icon: 'fa-microphone' },
      { text: 'iPhone 7 / 7 Plus con "Boot lento y botón de altavoz gris"', nextId: 'audio_ic', icon: 'fa-microchip' }
    ]
  },
  loudspeaker: {
    id: 'loudspeaker',
    solutionTitle: 'Altavoz Defectuoso',
    solutionSteps: [
      '1. Validar que no esté sucio la malla externa.',
      '2. Reemplazar pieza que contacta al flex inferior.',
      '3. Si tampoco un parlante nuevo suena, el Audio Codec Amp en la placa puede estar en corto.'
    ]
  },
  earpiece: {
    id: 'earpiece',
    solutionTitle: 'Falla Auricular llamadas',
    solutionSteps: [
      '1. Usualmente es suciedad (El 80% de los casos). Aplicar alcohol y cepillar la malla o retirarla.',
      '2. Si está limpio y no suena, cambiar componente auricular.',
      '3. iPhone Modelos Grandes (X y superiores), verificar el flex (flood illuminator) con cuidado por FaceID.'
    ]
  },
  mic: {
    id: 'mic',
    solutionTitle: 'Micrófono dañado',
    solutionSteps: [
      'Nota: Chequear si falla en apps de mensajería (Mic inferior) vs llamada en altavoz (Mic Superior).',
      '1. Si es inferior: Cambiar sub-placa o módulo inferior.',
      '2. Si se cambia la placa y falla, revisar el cable coaxial de antena/datos que va a la placa base.'
    ]
  },
  audio_ic: {
    id: 'audio_ic',
    solutionTitle: 'Falla IC de Audio (Enfermedad del iPhone 7)',
    solutionSteps: [
      'Es un defecto de fábrica del iPhone 7 y 7 Plus provocado por flexión en el chasis.',
      '1. Requiere microsoldadura avanzada.',
      '2. Quitar Audio IC, realizar jumper en la pista rota (usualmente M2 o C12) en la Motherboard.',
      '3. Replicar la soldadura y volver a montar el Audio IC.'
    ]
  },

  // -- Signal --
  signal_issues: {
    id: 'signal_issues',
    question: '¿Qué error muestra respecto a la red celular?',
    options: [
      { text: 'Dice "Sin Servicio" o "Solo llamadas de emergencia"', nextId: 'no_service', icon: 'fa-signal' },
      { text: 'Señal débil o intermitente', nextId: 'weak_signal', icon: 'fa-broadcast-tower' },
      { text: 'En iPhone muestra "Buscando..." permanentemente e IMEI *#06# no aparece', nextId: 'baseband_fail', icon: 'fa-exclamation-triangle' }
    ]
  },
  no_service: {
    id: 'no_service',
    solutionTitle: 'Sin Servicio',
    solutionSteps: [
      '1. Chequear estado del chip / Probar con un chip nuevo de otra compañía.',
      '2. Chequear en ENACOM/Sitios que el IMEI no esté reportado en banda negativa (Robo/Extravío).',
      '3. Desarmar equipo y chequear que los cables coaxiales de antena estén conectados a la sub-placa correctamente.'
    ]
  },
  weak_signal: {
    id: 'weak_signal',
    solutionTitle: 'Señal Débil',
    solutionSteps: [
      '1. Contactos de antena en el marco inferior sucios o doblados.',
      '2. Cambiar sub-placa (Pin de carga) ya que allí muchas veces reside la antena en terminales de gama media/baja.',
      '3. Configuración APN incorrecta: Restablecer ajustes de red desde menú del software.'
    ]
  },
  baseband_fail: {
    id: 'baseband_fail',
    solutionTitle: 'Falla de Baseband (Placa Modem)',
    solutionSteps: [
      'Si se marca "*#06#" en el marcador de teléfono y no arroja nada (se queda en blanco), entonces es daño en Baseband.',
      'Es un daño complejo de motherboard.',
      'Se debe resoldar o aplicar Reballing al IC Baseband o su fuente de alimentación (WTR / PMU-BB).'
    ]
  },

  // -- Software --
  software_issues: {
    id: 'software_issues',
    solutionTitle: 'Mantenimiento y Software',
    solutionSteps: [
      '1. Respaldar info del cliente (Solo si lo solicita y autoriza).',
      '2. Realizar un "Factory Data Reset" si el equipo lo permite.',
      '3. Si tiene patrón olvidado o cuenta Google (FRP), requerirá un borrado usando las teclas de volumen y usar herramientas de terceros (Octoplus, UnlockTool) para saltear protección, SI EL CLIENTE demuetra Titularidad.',
      '4. Lentitud general: En Android, limpiar la app "Google Play Services" e inhabilitar bloatware.'
    ]
  }
};

@Component({
  selector: 'app-diagnostic-protocol-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './diagnostic-protocol-page.html'
})
export class DiagnosticProtocolPage {
  
  history = signal<DiagnosticNode[]>([]);
  currentNode = signal<DiagnosticNode>(DIAGNOSTIC_TREE['start']);

  constructor() {
    this.history.set([DIAGNOSTIC_TREE['start']]);
  }

  selectOption(nextId: string) {
    const nextNode = DIAGNOSTIC_TREE[nextId];
    if (nextNode) {
      this.currentNode.set(nextNode);
      this.history.update(h => [...h, nextNode]);
    } else {
      console.error(`Node ${nextId} not found in tree`);
    }
  }

  goBack() {
    this.history.update(h => {
      const newHistory = [...h];
      if (newHistory.length > 1) {
        newHistory.pop();
        this.currentNode.set(newHistory[newHistory.length - 1]);
      }
      return newHistory;
    });
  }

  reset() {
    const startNode = DIAGNOSTIC_TREE['start'];
    this.currentNode.set(startNode);
    this.history.set([startNode]);
  }
}
