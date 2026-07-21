import { create } from "zustand";

export interface MCUModel {
  id: string;
  name: string;          // e.g. "STM32F407VET6"
  series: string;        // e.g. "F4"
  package: string;       // e.g. "LQFP-100"
  pins: number;
  flash: number;         // KB
  ram: number;           // KB
  freq: number;          // MHz
  cores: string;         // "Cortex-M4"
  voltage: string;       // "1.8V - 3.6V"
  gpio: number;
  adc: { channels: number; bits: number };
  dac: { channels: number; bits: number };
  timers: number;
  uart: number;
  spi: number;
  i2c: number;
  can: number;
  usb: boolean;
  ethernet: boolean;
  lowPower: boolean;
  price: number;         // CNY
  description: string;
}

interface MCUState {
  database: MCUModel[];
  bySeries: Record<string, MCUModel[]>;
  loaded: boolean;
  loadDatabase: (mcus: MCUModel[]) => void;
  getBySeries: (series: string) => MCUModel[];
  search: (query: string) => MCUModel[];
}

/** STM32 MCU database — Phase 1 covers all major STM32 series */
const STM32_DATABASE: MCUModel[] = [
  // ── F0 Series ──
  { id: "stm32f030f4p6", name: "STM32F030F4P6", series: "F0", package: "TSSOP-20", pins: 20, flash: 16, ram: 4, freq: 48, cores: "Cortex-M0", voltage: "2.4V-3.6V", gpio: 15, adc: { channels: 10, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 4, uart: 1, spi: 1, i2c: 1, can: 0, usb: false, ethernet: false, lowPower: false, price: 3.5, description: "入门级 Cortex-M0，极低成本" },
  { id: "stm32f030c8t6", name: "STM32F030C8T6", series: "F0", package: "LQFP-48", pins: 48, flash: 64, ram: 8, freq: 48, cores: "Cortex-M0", voltage: "2.4V-3.6V", gpio: 39, adc: { channels: 12, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 6, uart: 2, spi: 2, i2c: 2, can: 0, usb: false, ethernet: false, lowPower: false, price: 5.0, description: "入门级 Cortex-M0，48 引脚丰富外设" },
  { id: "stm32f051r8t6", name: "STM32F051R8T6", series: "F0", package: "LQFP-64", pins: 64, flash: 64, ram: 8, freq: 48, cores: "Cortex-M0", voltage: "2.0V-3.6V", gpio: 55, adc: { channels: 16, bits: 12 }, dac: { channels: 1, bits: 12 }, timers: 8, uart: 2, spi: 2, i2c: 2, can: 0, usb: false, ethernet: false, lowPower: false, price: 6.5, description: "F0 中配，DAC + 16ch ADC" },

  // ── F1 Series ──
  { id: "stm32f103c8t6", name: "STM32F103C8T6", series: "F1", package: "LQFP-48", pins: 48, flash: 64, ram: 20, freq: 72, cores: "Cortex-M3", voltage: "2.0V-3.6V", gpio: 37, adc: { channels: 10, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 4, uart: 3, spi: 2, i2c: 2, can: 1, usb: true, ethernet: false, lowPower: false, price: 7.0, description: "经典蓝色药丸，社区资源丰富" },
  { id: "stm32f103rbt6", name: "STM32F103RBT6", series: "F1", package: "LQFP-64", pins: 64, flash: 128, ram: 20, freq: 72, cores: "Cortex-M3", voltage: "2.0V-3.6V", gpio: 51, adc: { channels: 16, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 4, uart: 3, spi: 2, i2c: 2, can: 1, usb: true, ethernet: false, lowPower: false, price: 9.0, description: "F103 中配 128KB Flash" },
  { id: "stm32f103vet6", name: "STM32F103VET6", series: "F1", package: "LQFP-100", pins: 100, flash: 512, ram: 64, freq: 72, cores: "Cortex-M3", voltage: "2.0V-3.6V", gpio: 80, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 8, uart: 5, spi: 3, i2c: 2, can: 1, usb: true, ethernet: false, lowPower: false, price: 15.0, description: "F103 旗舰，512KB Flash + 64KB RAM" },

  // ── F2 Series ──
  { id: "stm32f207vct6", name: "STM32F207VCT6", series: "F2", package: "LQFP-100", pins: 100, flash: 256, ram: 128, freq: 120, cores: "Cortex-M3", voltage: "1.8V-3.6V", gpio: 82, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 10, uart: 4, spi: 3, i2c: 3, can: 2, usb: true, ethernet: true, lowPower: false, price: 25.0, description: "带以太网，128KB RAM" },

  // ── F3 Series ──
  { id: "stm32f303cct6", name: "STM32F303CCT6", series: "F3", package: "LQFP-48", pins: 48, flash: 256, ram: 40, freq: 72, cores: "Cortex-M4", voltage: "2.0V-3.6V", gpio: 37, adc: { channels: 11, bits: 12 }, dac: { channels: 3, bits: 12 }, timers: 10, uart: 5, spi: 3, i2c: 2, can: 1, usb: true, ethernet: false, lowPower: false, price: 14.0, description: "混合信号强项，3 路 DAC" },

  // ── F4 Series ──
  { id: "stm32f407vet6", name: "STM32F407VET6", series: "F4", package: "LQFP-100", pins: 100, flash: 512, ram: 192, freq: 168, cores: "Cortex-M4", voltage: "1.8V-3.6V", gpio: 82, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 14, uart: 4, spi: 3, i2c: 3, can: 2, usb: true, ethernet: true, lowPower: false, price: 28.0, description: "高性能 DSP + FPU + 以太网" },
  { id: "stm32f407zgt6", name: "STM32F407ZGT6", series: "F4", package: "LQFP-144", pins: 144, flash: 1024, ram: 192, freq: 168, cores: "Cortex-M4", voltage: "1.8V-3.6V", gpio: 114, adc: { channels: 24, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 14, uart: 6, spi: 3, i2c: 3, can: 2, usb: true, ethernet: true, lowPower: false, price: 38.0, description: "F4 旗舰 1MB Flash，144 引脚" },
  { id: "stm32f429igt6", name: "STM32F429IGT6", series: "F4", package: "LQFP-176", pins: 176, flash: 1024, ram: 256, freq: 180, cores: "Cortex-M4", voltage: "1.8V-3.6V", gpio: 140, adc: { channels: 24, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 14, uart: 8, spi: 6, i2c: 3, can: 2, usb: true, ethernet: true, lowPower: false, price: 55.0, description: "LCD-TFT 控制器 + SDRAM，GUI 首选" },

  // ── F7 Series ──
  { id: "stm32f746ng", name: "STM32F746NGH6", series: "F7", package: "TFBGA-216", pins: 216, flash: 1024, ram: 340, freq: 216, cores: "Cortex-M7", voltage: "1.7V-3.6V", gpio: 168, adc: { channels: 24, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 15, uart: 4, spi: 6, i2c: 4, can: 2, usb: true, ethernet: true, lowPower: false, price: 65.0, description: "Cortex-M7 DSP + 双精度 FPU + LCD" },

  // ── G0 Series ──
  { id: "stm32g030f6p6", name: "STM32G030F6P6", series: "G0", package: "TSSOP-20", pins: 20, flash: 32, ram: 8, freq: 64, cores: "Cortex-M0+", voltage: "1.7V-3.6V", gpio: 17, adc: { channels: 8, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 5, uart: 2, spi: 2, i2c: 2, can: 0, usb: false, ethernet: false, lowPower: false, price: 3.0, description: "新一代入门，性价比极高" },
  { id: "stm32g070rbt6", name: "STM32G070RBT6", series: "G0", package: "LQFP-64", pins: 64, flash: 128, ram: 36, freq: 64, cores: "Cortex-M0+", voltage: "1.7V-3.6V", gpio: 59, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 9, uart: 4, spi: 3, i2c: 2, can: 0, usb: true, ethernet: false, lowPower: false, price: 8.0, description: "G0 中配，USB + DAC" },

  // ── G4 Series ──
  { id: "stm32g431cbt6", name: "STM32G431CBT6", series: "G4", package: "LQFP-48", pins: 48, flash: 128, ram: 32, freq: 170, cores: "Cortex-M4", voltage: "1.71V-3.6V", gpio: 38, adc: { channels: 17, bits: 12 }, dac: { channels: 4, bits: 12 }, timers: 10, uart: 3, spi: 3, i2c: 3, can: 1, usb: true, ethernet: false, lowPower: false, price: 12.0, description: "数字电源控制，高分辨率定时器" },
  { id: "stm32g474vet6", name: "STM32G474VET6", series: "G4", package: "LQFP-100", pins: 100, flash: 512, ram: 128, freq: 170, cores: "Cortex-M4", voltage: "1.71V-3.6V", gpio: 86, adc: { channels: 26, bits: 12 }, dac: { channels: 7, bits: 12 }, timers: 17, uart: 5, spi: 4, i2c: 4, can: 3, usb: true, ethernet: false, lowPower: false, price: 25.0, description: "G4 旗舰，高分辨率 PWM + 7 路 DAC" },

  // ── H7 Series ──
  { id: "stm32h743vit6", name: "STM32H743VIT6", series: "H7", package: "LQFP-100", pins: 100, flash: 2048, ram: 1024, freq: 480, cores: "Cortex-M7", voltage: "1.62V-3.6V", gpio: 82, adc: { channels: 20, bits: 16 }, dac: { channels: 2, bits: 12 }, timers: 18, uart: 4, spi: 6, i2c: 4, can: 2, usb: true, ethernet: true, lowPower: false, price: 80.0, description: "双核可选，480MHz + 16bit ADC" },

  // ── L0 Series ──
  { id: "stm32l031k6t6", name: "STM32L031K6T6", series: "L0", package: "LQFP-32", pins: 32, flash: 32, ram: 8, freq: 32, cores: "Cortex-M0+", voltage: "1.65V-3.6V", gpio: 25, adc: { channels: 10, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 3, uart: 1, spi: 1, i2c: 1, can: 0, usb: false, ethernet: false, lowPower: true, price: 5.0, description: "超低功耗入门，EEPROM" },

  // ── L1 Series ──
  { id: "stm32l151cbt6", name: "STM32L151CBT6", series: "L1", package: "LQFP-48", pins: 48, flash: 128, ram: 16, freq: 32, cores: "Cortex-M3", voltage: "1.65V-3.6V", gpio: 37, adc: { channels: 14, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 6, uart: 3, spi: 2, i2c: 2, can: 0, usb: true, ethernet: false, lowPower: true, price: 10.0, description: "超低功耗 Cortex-M3 + USB + LCD" },

  // ── L4 Series ──
  { id: "stm32l431cbt6", name: "STM32L431CBT6", series: "L4", package: "LQFP-48", pins: 48, flash: 128, ram: 64, freq: 80, cores: "Cortex-M4", voltage: "1.71V-3.6V", gpio: 39, adc: { channels: 10, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 8, uart: 3, spi: 3, i2c: 3, can: 1, usb: true, ethernet: false, lowPower: true, price: 18.5, description: "超低功耗 Cortex-M4 + FPU，IoT 首选" },
  { id: "stm32l476rgt6", name: "STM32L476RGT6", series: "L4", package: "LQFP-64", pins: 64, flash: 1024, ram: 128, freq: 80, cores: "Cortex-M4", voltage: "1.71V-3.6V", gpio: 51, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 11, uart: 5, spi: 3, i2c: 3, can: 1, usb: true, ethernet: false, lowPower: true, price: 25.0, description: "L4 旗舰 1MB Flash，超低功耗" },

  // ── L5 Series ──
  { id: "stm32l552zet6q", name: "STM32L552ZET6Q", series: "L5", package: "LQFP-144", pins: 144, flash: 512, ram: 256, freq: 110, cores: "Cortex-M33", voltage: "1.71V-3.6V", gpio: 115, adc: { channels: 16, bits: 12 }, dac: { channels: 2, bits: 12 }, timers: 11, uart: 5, spi: 3, i2c: 4, can: 1, usb: true, ethernet: false, lowPower: true, price: 35.0, description: "Cortex-M33 + TrustZone + 256KB RAM" },

  // ── U5 Series ──
  { id: "stm32u575zi", name: "STM32U575ZIT6Q", series: "U5", package: "LQFP-144", pins: 144, flash: 2048, ram: 786, freq: 160, cores: "Cortex-M33", voltage: "1.71V-3.6V", gpio: 112, adc: { channels: 18, bits: 14 }, dac: { channels: 2, bits: 12 }, timers: 14, uart: 5, spi: 4, i2c: 4, can: 1, usb: true, ethernet: false, lowPower: true, price: 50.0, description: "超低功耗旗舰，2MB Flash + 14bit ADC" },

  // ── WB Series ──
  { id: "stm32wb55cg", name: "STM32WB55CGU6", series: "WB", package: "UFQFPN-48", pins: 48, flash: 1024, ram: 256, freq: 64, cores: "Cortex-M4 + M0+", voltage: "1.71V-3.6V", gpio: 30, adc: { channels: 8, bits: 12 }, dac: { channels: 0, bits: 0 }, timers: 7, uart: 1, spi: 2, i2c: 3, can: 0, usb: true, ethernet: false, lowPower: true, price: 22.0, description: "双核 + BLE 5.3 + Zigbee" },

  // ── WL Series ──
  { id: "stm32wle5cc", name: "STM32WLE5CCU6", series: "WL", package: "UFQFPN-48", pins: 48, flash: 256, ram: 64, freq: 48, cores: "Cortex-M4", voltage: "1.8V-3.6V", gpio: 29, adc: { channels: 6, bits: 12 }, dac: { channels: 1, bits: 12 }, timers: 3, uart: 2, spi: 2, i2c: 3, can: 0, usb: false, ethernet: false, lowPower: true, price: 18.0, description: "LoRa 集成，IoT LPWAN 首选" },
];

export const useMCUStore = create<MCUState>()((set, get) => ({
  database: STM32_DATABASE,
  bySeries: STM32_DATABASE.reduce(
    (acc, mcu) => {
      (acc[mcu.series] ??= []).push(mcu);
      return acc;
    },
    {} as Record<string, MCUModel[]>,
  ),
  loaded: true,
  loadDatabase: (mcus) =>
    set({
      database: mcus,
      bySeries: mcus.reduce(
        (acc, mcu) => {
          (acc[mcu.series] ??= []).push(mcu);
          return acc;
        },
        {} as Record<string, MCUModel[]>,
      ),
      loaded: true,
    }),
  getBySeries: (series) => get().bySeries[series] ?? [],
  search: (query) => {
    const q = query.toLowerCase();
    return get().database.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.series.toLowerCase().includes(q) ||
        m.description.includes(q) ||
        m.package.toLowerCase().includes(q),
    );
  },
}));
