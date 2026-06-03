import { FC, useState, useEffect, MouseEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import draftToHtmlPuri from 'draftjs-to-html';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Popover from '@mui/material/Popover';

import { useMedia } from '../../../hooks';
import { loadImage, uploadImage } from '../../utils';
import { Transition } from '../Transition';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.scss';

export const BrandCard: FC<any> = ({ value, isOpen, onClose, onSave }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isMobile = useMedia('(max-width: 768px)');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [logo, setLogo] = useState();
  const [logoSrc, setLogoSrc] = useState();
  const [editorState, setEditorState] = useState<any>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (value && isOpen) {
      setTitle(value.title);
      setCountry(value.country ?? '');
      loadImage(value.imageId).then(setImgSrc);
      loadImage(value.logoId).then(setLogoSrc);

      const blocks = htmlToDraft(value.description ?? '');
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            blocks.contentBlocks,
            blocks.entityMap
          )
        )
      );
    }
  }, [value, isOpen]);

  const handleUploadImage = (event: any) => {
    const file = event?.target?.files?.[0];

    if (!file) return;
    setImage(file);
  };

  const handleUploadLogo = (event: any) => {
    const file = event?.target?.files?.[0];

    if (!file) return;
    setLogo(file);
  };

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    const description = draftToHtmlPuri(
      convertToRaw(editorState?.getCurrentContent?.())
    );

    const isValid =
      title.trim() && (image || value?.imageId) && description !== '<p></p>\n';

    if (!isValid) {
      setAnchorEl(event.currentTarget);
      return;
    }

    try {
      let imageId = value?.imageId;

      if (image) {
        imageId = await uploadImage(image);
      }

      let logoId = value?.logoId;

      if (logo) {
        logoId = await uploadImage(logo);
      }

      const data = {
        ...value,
        title: title.trim(),
        country: country.trim(),
        imageId,
        logoId,
        description,
      };

      const response = await axios.post('/brand', data);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      clearForm();
      onSave();
    } catch (error) {
      console.log(error);
      toast.error('Произошла ошибка, попробуйте позже');
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    onClose();
    clearForm();
  };

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  };

  const clearForm = () => {
    setTitle('');
    setCountry('');
    setImage(undefined);
    setImgSrc(undefined);
    setLogo(undefined);
    setLogoSrc(undefined);
    setEditorState(EditorState.createEmpty());
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {value ? 'Редактирование' : 'Создание'} бренда
          </Typography>
          <Button
            aria-describedby={id}
            autoFocus
            color="inherit"
            onClick={handleSave}
          >
            Сохранить
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Typography sx={{ p: 2 }}>Заполните поля</Typography>
          </Popover>
        </Toolbar>
      </AppBar>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            my: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Наименование"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            mb: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Button variant="contained" component="label">
          Загрузить картинку
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUploadImage}
          />
        </Button>

        {(image || imgSrc) && (
          <div>
            <img
              alt="not found"
              width="250px"
              src={URL.createObjectURL(image || imgSrc!)}
            />
          </div>
        )}
      </Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            my: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Страна"
          variant="outlined"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            mb: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Button variant="contained" component="label">
          Загрузить логотип бренда
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUploadLogo}
          />
        </Button>

        {(logo || logoSrc) && (
          <div>
            <img
              alt="not found"
              width="250px"
              src={URL.createObjectURL(logo || logoSrc!)}
            />
          </div>
        )}
      </Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            my: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <div>Описание</div>
        <Editor
          toolbar={{
            inline: { inDropdown: true },
            options: [
              'inline',
              'blockType',
              'fontSize',
              'colorPicker',
              'textAlign',
              'history',
            ],
          }}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
        />
      </Box>
    </Dialog>
  );
};
