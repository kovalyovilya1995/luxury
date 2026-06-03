import { FC, useState, useEffect, MouseEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
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
import { Transition } from '../Transition';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.scss';

export const FAQCard: FC<any> = ({ value, isOpen, onClose, onSave }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isMobile = useMedia('(max-width: 768px)');
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState<any>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (value && isOpen) {
      setTitle(value.titleRu);
      const blocks = htmlToDraft(value.descriptionRu);
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

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    const description = draftToHtmlPuri(
      convertToRaw(editorState?.getCurrentContent?.())
    );

    const isValid = title.trim() && description !== '<p></p>\n';

    if (!isValid) {
      setAnchorEl(event.currentTarget);
      return;
    }

    try {
      const data = {
        ...value,
        titleRu: title.trim(),
        descriptionRu: description,
        titleEng: title.trim(),
        descriptionEng: description,
      };

      const response = await axios.post('/faq', data);
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

  const clearForm = () => {
    setTitle('');
    setEditorState(EditorState.createEmpty());
  };

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
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
            {value ? 'Редактирование' : 'Создание'} faq
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
          label="Вопрос"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <div>Ответ</div>
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
