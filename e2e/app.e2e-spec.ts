import { PoulzinhoPage } from './app.po';

describe('poulzinho App', function() {
  let page: PoulzinhoPage;

  beforeEach(() => {
    page = new PoulzinhoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
