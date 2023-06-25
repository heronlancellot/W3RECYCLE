import { useState, ChangeEvent, useEffect } from 'react';
import {useParams} from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import { useContractLoadTokenId } from "src/utils/Web3Erc721Utils"
import MintInfoTab from './MintInfoTab';
import SuspenseLoader from 'src/components/SuspenseLoader';
import ProductTab from './ProductTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementProductSettings() {
  const [currentTab, setCurrentTab] = useState<string>('product');
  const { tokenId } = useParams();
  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();
  

  const tabs = [
    { value: 'product', label: 'Product Info' },
    { value: 'mint-info', label: 'Mint Info' }
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  async function loadData() {
    setLoading(true);
    loadNft(tokenId);
    setLoading(false);
  }

  useEffect(() =>{
    
    if (!loading){
      if (data == null)
        loadData();
    }
      
    
  })

  useEffect(() =>{
    console.log("data", data)
    console.log("loading", loading)
  }, [loading, data])

  return (
    <>
      <Helmet>
        <title>Products Settings - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      {loading 
      ? <SuspenseLoader />
      :
        data == null && (tokenId!=null && +tokenId >=0) ? <SuspenseLoader />
        :
        (
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <TabsWrapper
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} disabled={tokenId == null && tab.value == 'mint-info'}/>
                  ))}
                </TabsWrapper>
              </Grid>
              <Grid item xs={12}>
                 {currentTab === 'product' && <ProductTab data={data} /> } 
            
                {/* {currentTab === 'activity' && <CollectPoint data={data}/> } */}
                {data && currentTab === 'mint-info' && <MintInfoTab data={data}/>}
              </Grid>
            </Grid>
          </Container>
        )
      }      
      <Footer />
    </>
  );
}

export default ManagementProductSettings;
