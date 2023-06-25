import { Box, List, ListItem, ListItemText, Typography, Menu, MenuItem } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useContractAccessControl } from 'src/utils/Web3Erc721Utils';
import { useAccount } from 'wagmi';
import SuspenseLoader from 'src/components/SuspenseLoader';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 20x;
                            width: 40px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { loading, setLoading, isLeader, checkLeader } =
    useContractAccessControl();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const validateLeader = async () => {
    setLoading(true);
    checkLeader();
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) validateLeader();
  });

  useEffect(() => {
    console.log('loading', loading);
    console.log('isLeader', isLeader);
  }, [loading, isLeader]);

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
          width: 'maxContent',
        }}
      >
        <List disablePadding component={Box} display="flex" >
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/dapp"
            
          >
        <Typography variant="h1" color={'#B56926'} sx={{ '&:hover': { color: 'green' }, whiteSpace: 'nowrap' }}> W3 RECICLE </Typography>
          </ListItem>
          {loading ? (
            <SuspenseLoader />
          ) :  (
            (
              <>
                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  component="a" 
                  href='https://w3-recicle.gitbook.io/w3-recycle/'>
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary={
                      <Typography
                        color={'white'}
                        sx={{ '&:hover': { color: 'green' },  }}
                        noWrap
                      >
                        Quem somos nós
                      </Typography>
                    }
                  />
                </ListItem>


                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  button
                  component={NavLink}
                  to="/dapp/product-register"
                  
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary={
                      <Typography
                        color={'white'}
                        sx={{ '&:hover': { color: 'green' } }}
                        noWrap
                      >
                        Cadastrar aparelho
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  button
                  ref={ref}
                  onClick={handleOpen}
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary={
                      <Typography
                        color={'white'}
                        sx={{ '&:hover': { color: 'green' } }}
                        noWrap
                      >
                        Administração
                      </Typography>
                    }
                  />
                </ListItem>
              </>
            )
          )}
        </List>
      </ListWrapper>
      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/dapp/products">
          Produtos
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/dapp/collectionpoints">
          Pontos de Coleta
        </MenuItem>
      </Menu>
    </>
  );
}

export default HeaderMenu;
