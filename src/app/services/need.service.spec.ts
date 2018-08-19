import { TestBed, inject } from '@angular/core/testing';

import { NeedService } from './need.service';

describe('NeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeedService]
    });
  });

  it('should be created', inject([NeedService], (service: NeedService) => {
    expect(service).toBeTruthy();
  }));
});
