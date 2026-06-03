import { FC, useState, useEffect, MouseEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import dayjs from 'dayjs';
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
import CancelIcon from '@mui/icons-material/Cancel';
import Popover from '@mui/material/Popover';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useMedia } from '../../../hooks';
import { loadImage, uploadImage } from '../../utils';
import { Transition } from '../Transition';
import { baseURL } from '../../..';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.scss';

export const NewsCard: FC<any> = ({ value, isOpen, onClose, onSave }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isMobile = useMedia('(max-width: 768px)');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<any>('');
  const [image, setImage] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [videoSrc, setVideoSrc] = useState('');

  const [images, setImages] = useState<any[]>([]);
  const [imageIds, setImageIds] = useState<any[]>([]);
  const refInput = useRef<any>();

  const [editorState, setEditorState] = useState<any>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (value && isOpen) {
      setDate(dayjs(value.newsDate));
      setTitle(value.titleRu || '');
      loadImage(value.imageId).then(setImgSrc);
      setImageIds(value.imageIds || []);
      setVideoSrc(value.videoUrls ?? '');

      const blocks = htmlToDraft(value.descriptionRus ?? '');
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

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    const description = draftToHtmlPuri(
      convertToRaw(editorState?.getCurrentContent?.())
    );

    const isValid =
      title.trim() &&
      date &&
      (image || value?.imageId) &&
      description !== '<p></p>\n';

    if (!isValid) {
      setAnchorEl(event.currentTarget);
      return;
    }

    try {
      let imageId = value?.imageId;

      if (image) {
        imageId = await uploadImage(image);
      }

      const valueImageIds = [...imageIds].filter((id) => id !== value?.imageId);

      if (images?.length) {
        for (const value of images) {
          const newId = await uploadImage(value);

          valueImageIds.push(newId);
        }
      }

      const data = {
        ...value,
        titleRu: title.trim(),
        newsDate: date.toISOString?.(),
        imageId,
        imageIds: valueImageIds,
        descriptionRus: description,
        videoUrls: videoSrc.trim(),
      };

      const response = await axios.post('/news', data);
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

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    onClose();
    clearForm();
  };

  const removeImages = (index: number) => {
    setImages(images.filter((item, ind) => ind !== index));
    refInput.current.value = null;
  };

  const handleUploadImages = (event: any) => {
    const files = event?.target?.files;

    setImages((prev) => [...prev, ...files]);
  };

  const removeImageIds = (id: number) => {
    setImageIds(imageIds.filter((item) => item !== id));
  };

  const clearForm = () => {
    setTitle('');
    setDate('');
    setImage(undefined);
    setImgSrc(undefined);
    setImages([]);
    setImageIds([]);
    setVideoSrc('');
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
            {value ? 'Редактирование' : 'Создание'} новости
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
          label="Заголовок"
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
        <DatePicker value={date} onChange={setDate} />
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
          label="Ссылка на видео"
          variant="outlined"
          value={videoSrc}
          onChange={(e) => setVideoSrc(e.target.value)}
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
          Загрузить картинку для превью
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
            mb: 3,
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100vw' : '50vw',
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Button variant="contained" component="label">
          Загрузить картинки для карточки
          <input
            type="file"
            multiple
            hidden
            ref={refInput}
            accept="image/*"
            onChange={handleUploadImages}
          />
        </Button>

        <div className="list-imgs">
          {imageIds
            ?.filter((id: number) => id !== value?.imageId)
            ?.map((id: number) => (
              <div key={id} className="list-img-item">
                <img
                  alt="not found"
                  width="250px"
                  src={`${baseURL}/images/${id}`}
                />
                <IconButton
                  aria-label="delete"
                  className="list-img-item__close"
                  onClick={() => removeImageIds(id)}
                >
                  <CancelIcon />
                </IconButton>
              </div>
            ))}
          {images?.map((item, index) => (
            <div key={index} className="list-img-item">
              <img
                alt="not found"
                width="250px"
                src={URL.createObjectURL(item)}
              />
              <IconButton
                aria-label="delete"
                className="list-img-item__close"
                onClick={() => removeImages(index)}
              >
                <CancelIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </Box>
    </Dialog>
  );
};
