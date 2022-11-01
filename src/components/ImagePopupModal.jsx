import React, { useEffect, useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  TwitterIcon,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  RedditIcon,
  TelegramIcon,
} from "react-share";

import {
  Box,
  Button,
  Modal,
  Typography,
  Stack,
  Grid,
  Popover,
} from "@mui/material";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useLocation, Link as RouterLink } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IosShareIcon from "@mui/icons-material/IosShare";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { authenticatedFetch, useAuth } from "../auth";

import "react-toastify/dist/ReactToastify.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: 4,
  boxShadow: 24,
};

const PAGE_SIZE = 9;

function ImagePopupModel({ open, onClose, image, isBehindLoginWall }) {
  const auth = useAuth();
  const location = useLocation();
  const { product, ad } = location.state || {};
  const [liked, setLiked] = useState(image.liked);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const opened = Boolean(anchorEl);
  const id = opened ? "simple-popover" : undefined;

  useEffect(() => {
    setLiked(image.liked);
  }, [image.liked]);

  // const printImg = (img) => {
  //   console.log(img);
  // };

  const onLikeClicked = () => {
    setLiked(true);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ image: image.id }),
    };

    authenticatedFetch("/image_likes/", requestOptions)
      .then((response) => {
        if (response.status === 201) {
          setLiked(true);
        } else {
          toast.error("Oops, something went wrong with the backend service!");
          setLiked(false);
        }
      })
      .catch((error) => {
        toast.error("Oops, something went wrong with the network!");
        setLiked(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Stack rowGap={2} sx={{ margin: 2 }}>
          <Typography variant="h6">Image Created</Typography>
          <Typography fontStyle="italic">Prompt: {image.title}</Typography>
        </Stack>
        <Grid container>
          <img src={image.file} alt={image.title} loading="lazy" width={400} />
        </Grid>
        <Stack rowGap={2} sx={{ padding: 3 }} justifyContent="center">
          {ad ? (
            <Button
              sx={{ textTransform: "none" }}
              component={RouterLink}
              to={`/ads/${ad.id}`}
              state={{ selectedImage: image, ad, product }}
              variant="outlined"
              fullWidth
            >
              Use it in
              {` "${ad.name}"`}
            </Button>
          ) : null}
          <Button
            component={RouterLink}
            to={isBehindLoginWall ? `/e/${image.id}` : `/try/e/${image.id}`}
            state={{ ad }}
            variant="contained"
            fullWidth
          >
            Edit
          </Button>
          <Stack direction="row" spacing={6}>
            <FacebookShareButton
              url={image.file}
              quote="hello"
              hashtag={"#React"}
            >
              <FacebookIcon size={40} round={true} />
            </FacebookShareButton>
            <TwitterShareButton
              url={image.file}
              title="hello"
              hashtags={"#React"}
            >
              <TwitterIcon url={image.file} size={40} round={true} />
            </TwitterShareButton>
            <WhatsappShareButton url={image.file} title="hello">
              <WhatsappIcon size={40} round={true} />
            </WhatsappShareButton>
            <Button aria-describedby={id} variant="text" onClick={handleClick}>
              Share to...
            </Button>
            <Popover
              id={id}
              open={opened}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography sx={{ p: 2 }}>
                <RedditShareButton url={image.file} title="hello">
                  <RedditIcon size={40} round={true} />
                </RedditShareButton>
                <TelegramShareButton url={image.file} title="hello">
                  <TelegramIcon size={40} round={true} />
                </TelegramShareButton>
              </Typography>
            </Popover>
          </Stack>
          {auth && auth.user ? (
            <Stack direction="row" columnGap={2}>
              <Button
                startIcon={<FavoriteIcon />}
                variant="outlined"
                fullWidth
                disabled={liked || !(auth && auth.user)}
                size="small"
                onClick={onLikeClicked}
              >
                Like
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Modal>
  );
}

export default ImagePopupModel;
