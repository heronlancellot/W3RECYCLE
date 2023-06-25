import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Tooltip,
  Avatar,
  CardMedia,
  IconButton
} from '@mui/material';
import { AvatarWrapper, CardCover } from './StyledImports';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

const ProfileCover = ({ user: UserProfile }) => {
  const handleButtonHome = () => {
    window.location.href = '/dapp/#';
  };

  return (
    <>
      <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title="Go back">
          <IconButton
            color="primary"
            sx={{ p: 2, mr: 2 }}
            onClick={handleButtonHome}
          >
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            Bem-vindo {UserProfile.name}
          </Typography>
          <Typography variant="subtitle2">
            Perfil do usuário {UserProfile.name}
          </Typography>
        </Box>
      </Box>

      <CardCover>
        <CardMedia image={UserProfile.coverImg} />
      </CardCover>
      <AvatarWrapper>
        <Avatar
          variant="rounded"
          alt={UserProfile.name}
          src={UserProfile.avatar}
        />
      </AvatarWrapper>

      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {UserProfile.name}
        </Typography>
        <Typography variant="subtitle2">{UserProfile.description}</Typography>
        <Typography sx={{ py: 2 }} variant="subtitle2" color="text.primary">
          {UserProfile.jobTitle} | {UserProfile.location} |
        </Typography>
        <Box
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <IconButton>
              <GitHubIcon />
            </IconButton>

            <IconButton>
              <InstagramIcon />
            </IconButton>

            <IconButton color="primary" sx={{ p: 0.5 }}>
              <MoreHorizTwoToneIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default ProfileCover;
