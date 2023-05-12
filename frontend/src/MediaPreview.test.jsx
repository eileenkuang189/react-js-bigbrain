import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaPreview from './components/MediaPreview';
import defaultThumbnail from './assets/bigbrain_default.png'

describe('Media Preview', () => {
  it('renders no preview message if no media is available', () => {
    render(<MediaPreview />);
    const noPreviewMessage = screen.getByText('No preview available');
    expect(noPreviewMessage).toBeInTheDocument();
  });

  it('renders image preview when image is available', () => {
    render(<MediaPreview selectedTag='image' image={defaultThumbnail} />);
    expect(screen.getByAltText('quiz image')).toBeInTheDocument();
  });

  it('renders video preview when video is available', () => {
    render(<MediaPreview selectedTag='video' videoUrl='https://www.youtube.com/embed/test' />);
    expect(screen.getByTitle('YouTube Preview')).toBeInTheDocument();
  });

  it('renders no preview message if no media is available but video tag is selected', () => {
    render(<MediaPreview selectedTag='video' videoUrl='' />);
    expect(screen.getByText('No preview available')).toBeInTheDocument();
  });

  it('renders no preview message if no media is available but image tag is selected', () => {
    render(<MediaPreview selectedTag='image' image='' />);
    expect(screen.getByText('No preview available')).toBeInTheDocument();
  });

  it('renders no preview message if image is available but video tag is selected', () => {
    render(<MediaPreview selectedTag='video' image={defaultThumbnail} videoUrl='' />);
    expect(screen.getByText('No preview available')).toBeInTheDocument();
  });

  it('renders no preview message if video is available but image tag is selected', () => {
    render(<MediaPreview selectedTag='image' image='' videoUrl='https://www.youtube.com/embed/test' />);
    expect(screen.getByText('No preview available')).toBeInTheDocument();
  });
});
