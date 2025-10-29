// Sistema de upload para S3 da AWS
class S3Uploader {
    constructor(bucketName = 'granja-recanto-feliz-produtos') {
        this.bucketName = bucketName;
        this.apiEndpoint = 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/upload';
    }

    async uploadImage(imageData, filename) {
        try {
            // Remove o prefixo data:image/png;base64,
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

            const payload = {
                imageData: base64Data,
                filename: filename,
                bucket: this.bucketName
            };

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Upload falhou: ${response.statusText}`);
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