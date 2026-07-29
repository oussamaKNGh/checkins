// ==========================================
// PC INSPECTION REPORT SYSTEM - DATABASE
// Version 2.0
// ==========================================

const DATA = {

    condition: [
        "ممتاز",
        "جيد",
        "متوسط",
        "يحتاج صيانة",
        "معطوب"
    ],

    conditionBadgeMap: {
        "ممتاز": "badge-excellent",
        "جيد": "badge-good",
        "متوسط": "badge-average",
        "يحتاج صيانة": "badge-needs-service",
        "معطوب": "badge-damaged"
    },

    cpu: {

        Intel: {

            "Core i3": [
                "i3-2100","i3-3220","i3-4130","i3-6100","i3-7100",
                "i3-8100","i3-9100F","i3-10100","i3-12100F","i3-13100F"
            ],

            "Core i5": [
                "i5-2400","i5-3470","i5-4590","i5-6500","i5-7400",
                "i5-8400","i5-9400F","i5-10400F","i5-11400F","i5-12400F","i5-13400F"
            ],

            "Core i7": [
                "i7-2600","i7-3770","i7-4790","i7-6700","i7-7700",
                "i7-8700","i7-9700","i7-10700","i7-11700","i7-12700F","i7-13700F"
            ],

            "Core i9": [
                "i9-9900K","i9-10900K","i9-11900K","i9-12900K","i9-13900K"
            ]

        },

        AMD: {

            "Ryzen 3": [
                "1200","2200G","3100","3200G","4100"
            ],

            "Ryzen 5": [
                "1600","2600","3600","4500","5500","5600","5600G","5600X"
            ],

            "Ryzen 7": [
                "1700","2700X","3700X","5700G","5800X"
            ],

            "Ryzen 9": [
                "3900X","5900X","5950X","7900X","7950X"
            ]

        }

    },

    gpu: {

        NVIDIA: [
            "GTX 750 Ti","GTX 960","GTX 1050 Ti","GTX 1060","GTX 1070",
            "GTX 1080","GTX 1650","GTX 1660 Super","RTX 2060","RTX 2070",
            "RTX 2080","RTX 3060","RTX 3070","RTX 3080","RTX 3090",
            "RTX 4060","RTX 4070","RTX 4080","RTX 4090"
        ],

        AMD: [
            "RX 470","RX 570","RX 580","RX 5500 XT","RX 5600 XT",
            "RX 6600","RX 6700 XT","RX 6800 XT","RX 7600","RX 7700 XT","RX 7800 XT"
        ],

        Intel: [
            "UHD 630","Iris Xe","Arc A380","Arc A750","Arc A770"
        ]

    },

    gpuVram: [
        "2 GB","4 GB","6 GB","8 GB","10 GB","12 GB","16 GB","24 GB"
    ],

    ram: {

        size: ["2 GB","4 GB","8 GB","16 GB","32 GB","64 GB"],

        type: ["DDR3","DDR4","DDR5"],

        speed: [
            "1333 MHz","1600 MHz","2133 MHz","2400 MHz","2666 MHz",
            "3000 MHz","3200 MHz","3600 MHz","4800 MHz","5600 MHz"
        ]

    },

    storage: {

        type: ["HDD","SSD SATA","SSD NVMe"],

        size: [
            "120 GB","240 GB","256 GB","480 GB","500 GB",
            "512 GB","1 TB","2 TB","4 TB"
        ],

        smart: ["سليم", "تحذير", "فشل"]

    },

    motherboard: {

        brand: ["ASUS","MSI","Gigabyte","ASRock","Biostar"],

        chipset: [
            "H61","B75","H81","B85","H110","B150","B250","B360","H310",
            "B460","B560","B660","B760","A320","B350","B450","B550","X570","B650","X670"
        ],

        formFactor: ["ATX","Micro-ATX","Mini-ITX"]

    },

    psu: {

        brand: ["Corsair","Cooler Master","EVGA","Antec","Thermaltake","Generic/OEM"],

        wattage: ["300W","450W","500W","550W","600W","650W","750W","850W","1000W"],

        certification: ["بدون شهادة","80+ White","80+ Bronze","80+ Gold","80+ Platinum","80+ Titanium"]

    },

    cooling: {

        type: ["مبرد هواء أصلي","مبرد هواء خارجي","تبريد مائي AIO","تبريد مائي مخصص"]

    },

    pcCase: {

        type: ["Mid Tower","Full Tower","Mini Tower","Mini ITX","Micro ATX"]

    },

    monitor: {

        size: ["15.6 بوصة","19 بوصة","21.5 بوصة","24 بوصة","27 بوصة","32 بوصة"],

        resolution: ["HD 1366x768","Full HD 1920x1080","2K 2560x1440","4K 3840x2160"],

        panel: ["TN","IPS","VA","OLED"]

    },

    battery: {

        health: ["ممتازة","جيدة","ضعيفة","لا تشحن"]

    },

    ports: [
        "USB 2.0","USB 3.0","USB Type-C","HDMI","DisplayPort","VGA",
        "Audio Jack","Ethernet RJ45","SD Card Reader"
    ],

    network: {

        wifi: ["لا يوجد","WiFi 4 (802.11n)","WiFi 5 (802.11ac)","WiFi 6 (802.11ax)"],

        ethernet: ["100 Mbps","1 Gbps","2.5 Gbps"]

    },

    checklist: [
        { id:"boot", label:"يعمل الجهاز عند التشغيل (Boot Test)" },
        { id:"noBeep", label:"لا يوجد أصوات تنبيه غير طبيعية (Beep Codes)" },
        { id:"biosAccess", label:"يمكن الدخول إلى BIOS/UEFI" },
        { id:"gpuOutput", label:"إخراج الصورة يعمل بشكل صحيح" },
        { id:"ramTest", label:"تم اختبار الرام (Memtest)" },
        { id:"storageSmart", label:"تم فحص SMART لوحدة التخزين" },
        { id:"usbTest", label:"تم اختبار جميع منافذ USB" },
        { id:"networkTest", label:"تم اختبار الشبكة السلكية/اللاسلكية" },
        { id:"keyboardTest", label:"تم اختبار لوحة المفاتيح (للأجهزة المحمولة)" },
        { id:"overheat", label:"لا يوجد ارتفاع غير طبيعي في الحرارة تحت الحمل" },
        { id:"fansNoise", label:"المراوح تعمل بدون ضوضاء غير طبيعية" },
        { id:"physicalDamage", label:"لا يوجد تلف مادي ظاهر في الهيكل" }
    ]

};