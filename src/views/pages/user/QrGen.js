import { Box, Button, Card, CardContent, Dialog, Grid } from '@mui/material'
import QRCode from 'qrcode.react'
import { useEffect, useState } from 'react'

export default function QrGen(param) {
  console.log("QR GEN",param)
  // console.debug(param)
  const qrData = param?.qr
  const [show, setShow] = useState(param?.show)
  useEffect(() => {
    if (!show & !!qrData) {
      setShow(true)
    }
  }, [qrData])
 

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas'); // Find the canvas element
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = param?.qr+' generatedQRCode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    const canvas = document.querySelector('canvas');
    const dataUrl = canvas.toDataURL('image/png');

    const img = new Image();
    img.src = dataUrl;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`<img src="${dataUrl}" onload="window.print();window.close()" width="300" /><p>${param?.qr}</p>`);
    printWindow.document.close();
  };


  return (
    <>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        // TransitionComponent={Transition}
        // onBackdropClick={() => setShow(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <Grid container spacing={6.5}>
          <Grid item xs={5}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 4.75, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <QRCode value={qrData} size={100}   />
                </Box>
                <Button
                  onClick={() => {
                    setShow(false)
                  }}
                >
                  Close
                </Button>

                <Button onClick={downloadQRCode}> Download </Button>
                <Button onClick={printQRCode}> Print </Button>

                
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <p>Email: {param?.userData?.email}</p>
            <p>User ID: {param.userData?.userId}</p>
            <p>Password: {param.userData?.password}</p>
            <p>PIN: {param.userData?.PIN}</p>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}
