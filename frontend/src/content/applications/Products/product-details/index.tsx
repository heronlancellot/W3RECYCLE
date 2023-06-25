import Footer from 'src/components/Footer';
import { Helmet } from 'react-helmet-async';
import { ethers } from 'ethers';
import { Grid, Container, Card } from '@mui/material';

import ActivityDetailsNft from 'src/components/Nfts/DetailsNft';
import { useContractLoadTokenId } from 'src/utils/Web3Erc721Utils';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import contractAddress from "src/contracts/contract-nfterc721-address.json";

function ProductDetails() {
  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();
  const {tokenId} = useParams();
  console.log('tokenId = ', tokenId);

  const provider = new ethers.providers.Web3Provider(window.ethereum); 

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

              <Grid item xs={12} md={12} >
                <ActivityDetailsNft data={data} loading={loading} tokenId={tokenId} contractAddress={contractAddress.NftERC721} signer={provider.getSigner()}/>
              </Grid>    
              
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ProductDetails;
