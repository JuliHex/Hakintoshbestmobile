// Kexts, firmware drivers, SSDTs and tools referenced by the per-laptop build guides.
// Names, sources and notes follow Dortania's OpenCore Install Guide ("Gathering files")
// and Getting Started With ACPI. Keep links pointing at official release pages.

const DORTANIA = 'https://dortania.github.io/OpenCore-Install-Guide';
const ACPI = 'https://dortania.github.io/Getting-Started-With-ACPI';
const POST = 'https://dortania.github.io/OpenCore-Post-Install';

export const LINKS = {
    installGuide: `${DORTANIA}/`,
    gatheringFiles: `${DORTANIA}/ktext.html`,
    usbInstaller: `${DORTANIA}/installer-guide/`,
    smbiosSupport: `${DORTANIA}/extras/smbios-support.html`,
    ventura: `${DORTANIA}/extras/ventura.html`,
    tahoe: `${DORTANIA}/extras/tahoe.html`,
    acpi: `${ACPI}/`,
    postInstall: `${POST}/`,
    usbMapping: `${POST}/usb/`,
    audio: `${POST}/universal/audio.html`,
    sleep: `${POST}/universal/sleep.html`,
    iservices: `${POST}/universal/iservices.html`,
    appleAlcCodecs: 'https://github.com/acidanthera/AppleALC/wiki/Supported-codecs',
    openCore: 'https://github.com/acidanthera/OpenCorePkg/releases'
};

export const TOOLS = [
    { name: 'OpenCorePkg', url: LINKS.openCore, why: 'The bootloader, plus OpenRuntime.efi, ocvalidate and macrecovery.py.' },
    { name: 'ProperTree', url: 'https://github.com/corpnewt/ProperTree', why: 'Edits config.plist. Use File > OC Snapshot after adding kexts and SSDTs.' },
    { name: 'SSDTTime', url: 'https://github.com/corpnewt/SSDTTime', why: 'Generates the SSDTs listed below from your laptop\'s ACPI tables.' },
    { name: 'GenSMBIOS', url: 'https://github.com/corpnewt/GenSMBIOS', why: 'Generates serial numbers for the SMBIOS model.' },
    { name: 'USBToolBox', url: 'https://github.com/USBToolBox/tool', why: 'Maps USB ports from Windows (or macOS) to stay under the 15-port limit.' }
];

export const DRIVERS = [
    { name: 'HfsPlus.efi', url: 'https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi', why: 'Lets OpenCore see macOS installers and recovery (HFS+ volumes). Don\'t mix with other HFS drivers.' },
    { name: 'OpenRuntime.efi', url: LINKS.openCore, why: 'NVRAM fixes and memory management. Bundled with OpenCorePkg.' }
];

// Every kext a laptop guide can recommend.
export const KEXTS = {
    Lilu: { url: 'https://github.com/acidanthera/Lilu/releases', why: 'Patching framework that most other kexts depend on. Must load first.' },
    VirtualSMC: { url: 'https://github.com/acidanthera/VirtualSMC/releases', why: 'Emulates the Mac SMC chip. macOS won\'t boot without it.' },
    SMCBatteryManager: { url: 'https://github.com/acidanthera/VirtualSMC/releases', why: 'Battery percentage and charging status. Included with VirtualSMC.' },
    SMCProcessor: { url: 'https://github.com/acidanthera/VirtualSMC/releases', why: 'CPU temperature monitoring. Included with VirtualSMC.' },
    SMCDellSensors: { url: 'https://github.com/acidanthera/VirtualSMC/releases', why: 'Finer fan monitoring and control on Dell laptops that support it. Included with VirtualSMC.' },
    WhateverGreen: { url: 'https://github.com/acidanthera/WhateverGreen/releases', why: 'Intel iGPU framebuffer patches, backlight and display fixes.' },
    AppleALC: { url: 'https://github.com/acidanthera/AppleALC/releases', why: 'Onboard audio. Needs a layout-id that matches your codec.' },
    VoodooHDA: { url: 'https://github.com/CloverHackyColor/VoodooHDA/releases', why: 'Analog audio on macOS 26 Tahoe, which removed AppleHDA. Installed to /Library/Extensions with SIP partly disabled, not in the EFI.' },
    VoodooPS2Controller: { url: 'https://github.com/acidanthera/VoodooPS2/releases', why: 'The built-in keyboard (almost always PS/2), plus PS/2 trackpads.' },
    VoodooI2C: { url: 'https://github.com/VoodooI2C/VoodooI2C/releases', why: 'Drives the I2C controller for I2C trackpads. Needs a plugin below.' },
    VoodooI2CHID: { url: 'https://github.com/VoodooI2C/VoodooI2C/releases', why: 'VoodooI2C plugin for multitouch HID trackpads and touchscreens (including ELAN1200 and newer).' },
    AlpsHID: { url: 'https://github.com/blankmac/AlpsHID/releases', why: 'ALPS I2C/USB trackpads, common on Dell and some HP models. Used with VoodooI2C.' },
    VoodooRMI: { url: 'https://github.com/VoodooSMBus/VoodooRMI/releases', why: 'Synaptics trackpads over SMBus (most ThinkPads and many business laptops). Depends on VoodooPS2.' },
    VoodooSMBus: { url: 'https://github.com/VoodooSMBus/VoodooSMBus/releases', why: 'ELAN trackpads over SMBus.' },
    ECEnabler: { url: 'https://github.com/1Revenger1/ECEnabler/releases', why: 'Lets macOS read battery fields longer than 8 bits, fixing missing or stuck battery status.' },
    BrightnessKeys: { url: 'https://github.com/acidanthera/BrightnessKeys/releases', why: 'Makes the brightness function keys work.' },
    NVMeFix: { url: 'https://github.com/acidanthera/NVMeFix/releases', why: 'Power management and initialization fixes for non-Apple NVMe SSDs.' },
    AirportItlwm: { url: 'https://github.com/OpenIntelWireless/itlwm/releases', why: 'Native-feeling Intel Wi-Fi that also works in Recovery. There\'s a separate build per macOS version, and it needs SecureBootModel enabled.' },
    itlwm: { url: 'https://github.com/OpenIntelWireless/itlwm/releases', why: 'Alternative Intel Wi-Fi kext, used with the HeliPort app. Doesn\'t work in Recovery.' },
    IntelBluetoothFirmware: { url: 'https://github.com/OpenIntelWireless/IntelBluetoothFirmware/releases', why: 'Intel Bluetooth. Add IntelBTPatcher (included) too.' },
    IntelBTPatcher: { url: 'https://github.com/OpenIntelWireless/IntelBluetoothFirmware/releases', why: 'Patches Intel Bluetooth bugs in macOS. Included with IntelBluetoothFirmware.' },
    IntelBluetoothInjector: { url: 'https://github.com/OpenIntelWireless/IntelBluetoothFirmware/releases', why: 'Only for macOS 10.13 to 11 with Intel Bluetooth. Included with IntelBluetoothFirmware.' },
    AirportBrcmFixup: { url: 'https://github.com/acidanthera/AirportBrcmFixup/releases', why: 'Patches non-Apple Broadcom Wi-Fi cards.' },
    AppleBCMWLANCompanion: { url: 'https://github.com/0xFireWolf/AppleBCMWLANCompanion', why: 'Broadcom Wi-Fi on macOS 15 and 26 without root patches. Not yet fully stable, and needs VT-d enabled.' },
    BrcmPatchRAM3: { url: 'https://github.com/acidanthera/BrcmPatchRAM/releases', why: 'Uploads firmware to Broadcom Bluetooth (macOS 10.15+). Pair with BrcmFirmwareData.' },
    BrcmPatchRAM2: { url: 'https://github.com/acidanthera/BrcmPatchRAM/releases', why: 'Uploads firmware to Broadcom Bluetooth (macOS 10.11 to 10.14). Pair with BrcmFirmwareData.' },
    BrcmFirmwareData: { url: 'https://github.com/acidanthera/BrcmPatchRAM/releases', why: 'Firmware for BrcmPatchRAM3. Included with BrcmPatchRAM.' },
    BrcmBluetoothInjector: { url: 'https://github.com/acidanthera/BrcmPatchRAM/releases', why: 'Only for macOS 10.11 to 11 with Broadcom Bluetooth. Included with BrcmPatchRAM.' },
    BlueToolFixup: { url: 'https://github.com/acidanthera/BrcmPatchRAM/releases', why: 'Patches the macOS 12+ Bluetooth stack for third-party cards. Included with BrcmPatchRAM. Don\'t use on macOS 11 or earlier.' },
    IntelMausi: { url: 'https://github.com/acidanthera/IntelMausi/releases', why: 'Intel Ethernet (I217, I218, I219 and similar).' },
    RealtekRTL8111: { url: 'https://github.com/Mieze/RTL8111_driver_for_OS_X/releases', why: 'Realtek Gigabit Ethernet, including Killer E2500 (which is Realtek-based).' },
    AtherosE2200Ethernet: { url: 'https://github.com/Mieze/AtherosE2200Ethernet/releases', why: 'Atheros and Killer Ethernet (except E2500, which needs RealtekRTL8111).' },
    RealtekCardReader: { url: 'https://github.com/0xFireWolf/RealtekCardReader/releases', why: 'Realtek PCIe/USB SD card readers. Pair with RealtekCardReaderFriend.' },
    RealtekCardReaderFriend: { url: 'https://github.com/0xFireWolf/RealtekCardReaderFriend/releases', why: 'Makes Realtek card readers show up as native in System Information.' },
    USBToolBox: { url: 'https://github.com/USBToolBox/kext/releases', why: 'Applies your USB map. Used together with the UTBMap.kext the tool generates.' },
    UTBMap: { url: 'https://github.com/USBToolBox/tool', why: 'Your laptop\'s USB port map, generated by the USBToolBox tool. Created after mapping, not downloaded.' },
    RestrictEvents: { url: 'https://github.com/acidanthera/RestrictEvents/releases', why: 'With the boot argument revpatch=sbvmm, enables over-the-air updates on macOS 14.4 and later.' }
};

export const SSDTS = {
    'SSDT-PLUG': { url: `${ACPI}/Universal/plug.html`, why: 'Enables native CPU power management (XCPM).' },
    'SSDT-EC': { url: `${ACPI}/Universal/ec-fix.html`, why: 'Gives macOS the embedded controller device it expects.' },
    'SSDT-EC-USBX': { url: `${ACPI}/Universal/ec-fix.html`, why: 'Embedded controller fix plus USB power properties.' },
    'SSDT-PNLF': { url: `${ACPI}/Laptops/backlight.html`, why: 'Backlight control: the brightness slider and keys.' },
    'SSDT-GPI0': { url: `${ACPI}/Laptops/trackpad.html`, why: 'Enables the GPIO controller so I2C trackpads work in interrupt mode.' },
    'SSDT-AWAC': { url: `${ACPI}/Universal/awac.html`, why: 'Fixes the system clock (AWAC/RTC) on 300-series chipsets and newer.' },
    'SSDT-PMC': { url: `${ACPI}/Universal/nvram.html`, why: 'Restores native NVRAM on 9th gen Coffee Lake platforms.' },
    'SSDT-RHUB': { url: `${ACPI}/Universal/rhub.html`, why: 'Resets the USB hub so USB ports work on Ice Lake.' },
    'IRQ SSDT': { url: `${ACPI}/Universal/irq.html`, why: 'Fixes IRQ conflicts (audio, USB) on older platforms. SSDTTime generates it.' },
    'SSDT-dGPU-Off': { url: `${ACPI}/Laptops/laptop-disable.html`, why: 'Powers off the NVIDIA dGPU, which macOS can\'t use, to save battery and heat.' }
};
