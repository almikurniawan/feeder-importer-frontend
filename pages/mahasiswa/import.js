import { CardContent } from '@mui/material';
import { Box, Toolbar, Typography, CssBaseline, Grid, FormControl, TextField, Card, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Header from '../../components/header';
import MenuFeeder from '../../components/menu';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';

export default function Home(props) {
    const [isBussy, setBussy] = useState(false);
    const [selectedJurusan, setSelectedJurusan] = useState(0);
    const [selectedTahun, setSelectedTahun] = useState(0);
    const [textCatatan, setTextCatatan] = useState('');

    const router = useRouter();

    const importFromOasis = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                jurusan: selectedJurusan,
                tahun: selectedTahun,
                catatan: textCatatan
            })
        });

        const res = await result.json();
        setBussy(false);
        if (res.status) {
            router.push('/mahasiswa/history/' + res.data.id);
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header />
            <MenuFeeder />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }} color>
                <Toolbar />
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" gutterBottom align='left'>
                            Import Mahasiswa
                        </Typography>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <FormControl>
                                <InputLabel id="label-jurusan">Jurusan</InputLabel>
                                <Select
                                    labelId='label-jurusan'
                                    value={selectedJurusan}
                                    label="Jurusan"
                                    onChange={(e) => setSelectedJurusan(e.target.value)}
                                >
                                    {
                                        props.jurusan.map((item, index) => {
                                            return (
                                                <MenuItem value={item.jur_id} key={index}>{item.jur_nama}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="label-tahun">Tahun Ajaran</InputLabel>
                                <Select
                                    labelId='label-tahun'
                                    id="label-tahun"
                                    value={selectedTahun}
                                    label="Tahun Ajaran"
                                    onChange={(e) => setSelectedTahun(e.target.value)}
                                >
                                    {
                                        props.tahun.map((item, index) => {
                                            return (
                                                <MenuItem value={item.tahun_id} key={index}>{item.tahun_label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <TextField label="Catatan" variant="outlined" value={textCatatan}
                                onChange={(e) => setTextCatatan(e.target.value)} />
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button variant="contained"
                                        disabled={isBussy}
                                        onClick={() => {
                                            setBussy(true);
                                            importFromOasis();
                                        }}
                                    > {
                                            (isBussy) ? <ClipLoader size={24} color={blue[500]} css={{ marginRight: '5px' }} /> : <></>
                                        } Ambil Data</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export async function getStaticProps() {
    const res = await fetch('http://192.168.0.35/feeder-backend/public/jurusan');
    const jurusan = await res.json();

    const resTahun = await fetch('http://192.168.0.35/feeder-backend/public/tahun');
    const tahun = await resTahun.json();

    return {
        props: {
            jurusan: jurusan,
            tahun: tahun
        },
    }
}