import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Material } from '../object/object';
import { MaterialService } from '../object/object.service';
import { SearchService } from '../search.service';
import { WindowService } from '../theming/window/window.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbHighlight],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  model: Material | null = null;
  materials: Material[] = [];

  private sub?: Subscription;

  constructor(
    private searchService: SearchService,
    private windowService: WindowService,
    private materialService: MaterialService
  ) {
    console.log('SearchComponent constructor called');
  }

  ngOnInit() {
    console.log('SearchComponent ngOnInit called');

    // Load all materials for typeahead
    this.materialService.getObjects().subscribe((materials: Material[]) => {
      this.materials = materials;
    });

    // Subscribe to search service for external query changes
    this.sub = this.searchService.query$.subscribe((q) => {
      console.log('Query changed to:', q);
      // Find material that matches the query
      const foundMaterial = this.materials.find(
        (m) => m.meta.name.toLowerCase() === q.toLowerCase()
      );
      this.model = foundMaterial || null;
    });
  }

  ngAfterViewInit() {
    // Force dropdown to append to body
    document.body.style.position = 'relative';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // Search function for typeahead
  search: OperatorFunction<string, readonly Material[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      map((term) => {
        if (term === '') {
          return [];
        }

        const filtered = this.materials
          .filter((material) =>
            material.meta.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 10); // Limit to 10 results

        console.log('Typeahead search results:', filtered);
        return filtered;
      })
    );

  // Format function to display material name in input
  formatter = (material: Material) => material.meta.name;

  // Get image URL for material
  getImageUrl(material: Material): string {
    if (material.image.url.length > 0) {
      return material.image.url;
    }

    // Return a simple SVG data URL as fallback
    return (
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21,15 16,10 5,21"></polyline>
      </svg>
    `)
    );
  }

  // Handle image load errors
  onImageError(event: any) {
    console.log('Image failed to load, using fallback');
    event.target.src = '/assets/placeholder.png';
  }

  // Handle selection
  onSelectItem(event: any) {
    console.log('Material selected:', event.item);
    const selectedMaterial = event.item as Material;

    if (selectedMaterial) {
      this.searchService.setQuery(selectedMaterial.meta.name);
      this.windowService.openDetailsWindow(
        selectedMaterial.id,
        selectedMaterial.meta.name
      );
    }
  }

  // Handle input changes
  onInputChange() {
    if (this.model && typeof this.model === 'object') {
      this.searchService.setQuery(this.model.meta.name);
    } else if (typeof this.model === 'string') {
      this.searchService.setQuery(this.model);
    }
  }
}
