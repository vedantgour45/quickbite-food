import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MenuImage } from '@/components/menu/MenuImage';

describe('MenuImage', () => {
  it('renders the <img> when src is provided', () => {
    render(
      <MenuImage
        src="https://images.test/pizza.jpg"
        alt="Pizza"
        category="pizza"
      />,
    );
    const img = screen.getByAltText('Pizza') as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.src).toContain('pizza.jpg');
    expect(screen.queryByTestId('menu-image-fallback')).not.toBeInTheDocument();
  });

  it('shows the fallback when the src is empty', () => {
    render(<MenuImage src="" alt="Empty" category="burger" />);
    const fallback = screen.getByTestId('menu-image-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('aria-label', 'Empty');
  });

  it('shows the fallback when the image fails to load', () => {
    render(
      <MenuImage
        src="https://images.test/dead.jpg"
        alt="Dead burger"
        category="burger"
      />,
    );
    const img = screen.getByAltText('Dead burger') as HTMLImageElement;
    fireEvent.error(img);
    expect(screen.getByTestId('menu-image-fallback')).toBeInTheDocument();
    expect(screen.queryByRole('img', { hidden: true })).toBeTruthy();
  });

  it('uses the generic icon when no category is given', () => {
    render(<MenuImage src="" alt="Unknown item" />);
    expect(screen.getByTestId('menu-image-fallback')).toBeInTheDocument();
  });
});
