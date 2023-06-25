import Footer from 'src/components/Footer';
import { Helmet } from 'react-helmet-async';
import { ethers } from 'ethers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Grid, Container } from '@mui/material';
import { Box, TextField, CardMedia, Typography, Card, CardHeader, Divider, Button } from '@mui/material';
import ActivityDetailsNft from 'src/components/Nfts/DetailsNft';
import { useContractLoadTokenId } from 'src/utils/Web3Erc721Utils';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import contractAddress from "src/contracts/contract-nfterc721-address.json";
import { Alert, CardActionsWrapper, CardCover, CardCoverAction } from '../StyleImports';

const Devices = [
  {
    value: '1', label: 'Galaxy S10+ (2019)'
  },
  {
    value: '2', label: 'iPhone 11 Pro Max (2019)',
  },
  {
    value: '3', label: 'Motorola Edge Plus (2020)'
  }
  ];
  
  const schema = yup.object({
    model: yup.string().required('Campo obrigatório.'),
    Fabricante: yup.string().required('Campo obrigatório.'),
    MEI: yup.string().required('Campo obrigatório.'),
  }).required();

function ProductRegister() {
  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();
  const {tokenId} = useParams();
  const [product, setProduct] = useState('');
  const [model, setModel] = useState('');
  const [emei, setEMEI] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  // Produto é NFT
  const [nft, setNft] = useState({
    mei: '',
    model: '',
    image: '',
    fabricant: '',
    external_url: process.env.REACT_APP_ERC721_METADATA_EXTERNAL_LINK,
    attributes: []
  });

  console.log('tokenId = ', tokenId);

  const provider = new ethers.providers.Web3Provider(window.ethereum); 

  const handleChangeFabricant = (event) => {
    setProduct(event.target.value);
    nft.attributes = [...nft.attributes, {
      trait_type: 'Fabricant',
      value:  event.target.value
    }];
  };

  const handleChangeModel = (event) => {
    setModel(event.target.value);
    nft.model = event.target.value;
  };

  const handleChangeEMEI = (event) => {
    setEMEI(event.target.value);
    nft.mei = event.target.value;
  };

  
  const onSubmit = async (event: { preventDefault: () => void; }) => {
    console.log("ENTROU NO SUBMIT")
    nft.attributes = [...nft.attributes, {
      trait_type: 'Model',
      value: model
    }];

    nft.attributes = [...nft.attributes, {
      trait_type: 'Device Type',
      value: "deviceType"
    }];


    //guarda metadata no ipfs e realiza o mint
    try {
      //const ipfsJsonResult = await uploadJsonToPinata(JSON.stringify(nft), "tokenUri.json");
      //setUploadJsonResult(ipfsJsonResult);
      //mintNft(ipfsJsonResult.IpfsHash, process.env.REACT_APP_DAPP_CONTRACT);
      //setOpenInformartion(true);
    } catch (error) {
      console.log("Erro: ", error);
    }
  };


  async function loadData() {
    setLoading(true);
    loadNft(tokenId);
    setLoading(false);
  }

  useEffect(() => {
    if (!loading){
      if (data == null)
        loadData();
    }
   
  })
  
  return (
    <>
      <Helmet>
        <title>Activity Details - Member</title>
      </Helmet>
      <Container sx={{mt: 3}} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems='center'
          spacing={2}
        >
          <Card>
                  <CardHeader title="Cadastre seu Eletroeletrônico" />
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1 }
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Box
                        sx={{
                          '& .MuiTextField-root': { m: 1 }
                        }}
                      >

                        <div>
                          <TextField fullWidth 
                            id="outlined-required"
                            select
                            label="Modelo do dispositivo"
                            value={product}
                            onChange={handleChangeModel}
                            disabled={data && data.tokenId >= 0 ? true : false}
                            SelectProps={{
                              native: true
                            }}
                          >    
                          {Devices.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}         
                            </TextField> 

                      
                        </div>
                        
                        <div> 
                        <TextField fullWidth {...register("EMEI")}
                            id="outlined-required"
                            label={data && data.name ? '' : 'EMEI'}
                            onChange={handleChangeEMEI}
                            placeholder={data && data.name ? '' : 'Ex: ESP240623'}
                            disabled={data && data.tokenId >= 0 ? true : false}
                            value={data && data.name}
                          />
                          <p>{errors.title?.message}</p>
                        </div>
                      </Box>
                      
                      <CardActionsWrapper
                        sx={{
                          display: { xs: 'block', md: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box>
                        </Box>
                        <Box sx={{ mt: { xs: 2, md: 0 } }}>
                          <Button type="submit" variant="contained">
                            Registrar Dispositivo
                          </Button>
                        </Box>
                      </CardActionsWrapper>
                  </Box>
          </Card>
              
              
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ProductRegister;
