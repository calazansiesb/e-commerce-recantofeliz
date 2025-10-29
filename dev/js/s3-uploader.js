// Sistema de upload para S3 da AWS
class S3Uploader {
    constructor() {
        // O nome do bucket agora é determinado pela Lambda, não pelo frontend.
        
        // Detectar ambiente (dev ou prod)
        const isDev = window.location.pathname.startsWith('/dev/');
        console.log('🔧 S3Uploader: Usando ambiente', isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
        
        // Endpoint da API de upload baseado no ambiente
        this.apiEndpoint = isDev 
            ? 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/dev/api/upload' 
            : 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/upload';
    }

    async uploadImage(imageData, filename) {
        try {
            // Remove o prefixo data:image/png;base64,
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
            
            const payload = {
                imageData: base64Data,
                filename: filename
                // O bucket e o caminho são definidos no backend (Lambda)
            };

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(`Upload falhou: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            return data.imageUrl; // URL da imagem no S3
        } catch (error) {
            console.error('Erro no upload para S3:', error);
            throw error;
        }
    }
}

window.s3Uploader = new S3Uploader();
console.log('✅ S3Uploader iniciado');