import { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { Project } from '../../types';
import { useMedia } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Response } from '../../store/types';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OrderCurtains } from '../../components/OrderCurtains';
import { ModalPhoto } from '../../components/modals/ModalPhoto';
import { ModalPhotoMobile } from '../../components/modals/ModalPhotoMobile';
import { baseURL } from '../..';

import './styles.scss';

export const ProjectCard: FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>();
  const [openModal, setOpenModal] = useState(false);

  const isMobile = useMedia('(max-width: 768px)');

  const getProject = useCallback(async () => {
    try {
      const url = '/projects?page=0&size=100&sort=number%2CASC';
      const response: Response<Project[]> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      const element = response.data.content.find(
        ({ id }) => id === Number(projectId)
      );
      element && setProject(element);
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

  useEffect(() => {
    const isCardProject = Number(projectId) > 0;

    if (!isCardProject || !projectId) {
      navigate('/');
    }

    getProject();
  }, [projectId, navigate, getProject]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleClickPhoto = (imageId: number, index: number) => {
    setActiveIndex(index);
    setActivePhoto(imageId);
    setOpenModal(true);
  };

  const showBreadcrumbs = !isMobile;

  return (
    <div className="project-card">
      <Header className="project-card__header" isMobile={isMobile} />

      {!isMobile &&
        !!project?.imageIds?.length &&
        !!activePhoto &&
        openModal && (
          <ModalPhoto
            active={activePhoto}
            photos={project.imageIds}
            onClose={() => setOpenModal(false)}
          />
        )}

      {isMobile && !!project?.imageIds?.length && !!activePhoto && (
        <ModalPhotoMobile
          initialActiveIndex={activeIndex}
          photos={project.imageIds}
          onClose={() => setActivePhoto(null)}
        />
      )}

      {!!project && (
        <div className="project-card__content">
          {showBreadcrumbs && <Breadcrumbs project={project} />}

          <div className="project-card__title">{project.title}</div>

          <div className="project-card__photos">
            {project.imageIds?.map((imageId, index) => (
              <img
                key={imageId}
                className="project-card__photos-item"
                src={`${baseURL}/images/${imageId}`}
                alt="imageId"
                onClick={() => handleClickPhoto(imageId, index)}
              />
            ))}
          </div>

          <OrderCurtains isMobile={isMobile} />
        </div>
      )}

      <Footer isMobile={isMobile} />
    </div>
  );
};
