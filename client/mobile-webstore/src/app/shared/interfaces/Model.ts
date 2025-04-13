export interface Model {
    uuid: string;
    name: string;
    colors: string[];
    pictures: string[];
    brand: string;
    basePrice: number;
    details: {
        cpu: {
            speed: number;
            cores: number;
        };
        display: {
            diameter: number;
            resolution: string;
            technology: string;
            refreshRate: number;
            colorDepth: string;
        };
        camera: {
            backResolution: string;
            backMaxZoom: number;
            frontResolution: string;
            autofocus: boolean;
            flashlight: boolean;
            recordingMaxResolution: string;
        };
        memory: {
            ram: number;
            storages: number[];
        };
        network: {
            simType: string;
            dualSim: boolean;
            has5g: boolean;
        };
        connection: {
            usb: string;
            jack: boolean;
            wifi: string;
            bluetooth: string;
            nfc: boolean;
        };
        physical: {
            height: number;
            width: number;
            depth: number;
            weight: number;
        };
        battery: number;
        os: string;
    };
}
