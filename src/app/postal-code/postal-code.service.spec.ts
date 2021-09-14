import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';

import { PostalCodeService } from './postal-code.service';

describe('PostalCodeService', () => {
  let service: PostalCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PostalCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
