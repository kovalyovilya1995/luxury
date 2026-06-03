import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Response } from '../../store/types';
import { useMedia } from '../../hooks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Icon } from '../../components/ui/Icon';
import { OrderCurtains } from '../../components/OrderCurtains';
import { ModalPhoto } from '../../components/modals/ModalPhoto';
import { ModalPhotoMobile } from '../../components/modals/ModalPhotoMobile';
import { Project } from '../../types';
import { baseURL } from '../..';

import './styles.scss';

export const Projects: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>();
  const [activePhotosProject, setActivePhotosProject] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const getProjects = async () => {
    try {
      const url = '/projects?page=0&size=100&sort=number%2CASC';
      const response: Response<any> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setProjects(response.data.content);
    } catch (error) {
      console.error(error);
      setProjects([]);
    }
  };

  const handleClickPhoto = (
    imageId: number,
    imageIds: number[],
    index: number
  ) => {
    setActiveIndex(index);
    setActivePhotosProject(imageIds);
    setActivePhoto(imageId);
    setOpenModal(true);
  };

  const showBreadcrumbs = !isMobile;
  const showModalPhotoDesktop =
    !isMobile && !!activePhotosProject.length && !!activePhoto && openModal;
  const showModalPhotoMobile =
    isMobile && !!activePhotosProject.length && !!activePhoto;

  return (
    <div className="projects-page">
      <Header className="projects-page__header" isMobile={isMobile} />
      {showModalPhotoDesktop && (
        <ModalPhoto
          active={activePhoto}
          photos={activePhotosProject}
          onClose={() => setOpenModal(false)}
        />
      )}

      {showModalPhotoMobile && (
        <ModalPhotoMobile
          initialActiveIndex={activeIndex}
          photos={activePhotosProject}
          onClose={() => setActivePhoto(null)}
        />
      )}
      <div className="projects-page__content">
        {showBreadcrumbs && <Breadcrumbs />}

        <div className="projects-page__title">{t('projects')}</div>

        <div
          className="projects-page__content-main"
          onClick={() => navigate('/projects/decor')}
        >
          <div className="projects-page__content-main-info">
            <div className="projects-page__content-main-title">
              {t('apartment-decor')}
            </div>
            <div className="projects-page__content-main-description">
              {t('apartment-decor-description')}
            </div>
            <button className="projects-page-button button">
              {t('more')}
              <Icon
                className="projects-page-button__icon"
                name="arrow-right"
                color="rgba(var(--white-400))"
                height={0.8875}
                width={1}
              />
            </button>
          </div>
          <img src="/decor.jpg" alt="apartment-decor" />
        </div>

        <div className="projects-page__content-blocks">
          {projects.map((project) => (
            <div className="projects-page__item" key={project.id}>
              <div
                className="projects-page__item-header"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="projects-page__item-title">{project.title}</div>
                <Icon
                  name="arrow-right"
                  size={1}
                  color="rgba(var(--grey-800))"
                />
              </div>
              {!!project?.imageIds && (
                <div className="projects-page__item-imgs">
                  {project.imageIds.slice(0, 3).map((imageId, index) => (
                    <img
                      key={imageId}
                      className="projects-page__item-img"
                      src={`${baseURL}/images/${imageId}`}
                      alt="imageId"
                      onClick={() =>
                        handleClickPhoto(imageId, project.imageIds!, index)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <OrderCurtains isMobile={isMobile} />
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};
