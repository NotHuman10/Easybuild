import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { JobCategory } from '@shared/models/job-category';

export class CategoryNode {
  item: JobCategory;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-job-category-tree',
  templateUrl: 'job-category-tree.component.html',
  styleUrls: ['job-category-tree.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JobCategoryTreeComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobCategoryTreeComponent implements ControlValueAccessor {
  private getLevel = (node: CategoryNode) => node.level;
  private isExpandable = (node: CategoryNode) => node.expandable;
  private getChildren = (node: JobCategory): JobCategory[] => node.subCategories;
  private onChange = (val: JobCategory[]) => { };
  private onTouch = (val: JobCategory[]) => { };
  private flatNodeMap = new Map<CategoryNode, JobCategory>();
  private nestedNodeMap = new Map<JobCategory, CategoryNode>();
  private treeFlattener: MatTreeFlattener<JobCategory, CategoryNode>;
  
  public hasChild = (_: number, _nodeData: CategoryNode) => _nodeData.expandable;
  public treeControl: FlatTreeControl<CategoryNode>;
  public dataSource: MatTreeFlatDataSource<JobCategory, CategoryNode>;
  public checklistSelection: SelectionModel<CategoryNode>;
 
  val: JobCategory[] = [];
  isMultiple: boolean = false;
  
  @Input() disabled: boolean = false;
  @Input() set value(val: JobCategory[]) {
    this.val = val;
    this.onChange(this.val);
  }
  @Input() set multiple(val: boolean) {
    this.isMultiple = coerceBooleanProperty(val);
    this.checklistSelection = new SelectionModel<CategoryNode>(this.isMultiple);
  }
  @Input() set data(val: JobCategory[]) {
    this.checklistSelection.clear();
    this.dataSource.data = val ?? [];
    this.value = [];
  }

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transform,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener, []);
    this.checklistSelection = new SelectionModel<CategoryNode>(this.isMultiple);
  }

  writeValue = (obj: JobCategory[]) => this.value = obj;
  registerOnChange = (fn: (val: JobCategory[]) => any) => this.onChange = fn;
  registerOnTouched = (fn: (val: JobCategory[]) => any) => this.onTouch = fn;
  setDisabledState? = (isDisabled: boolean) => this.disabled = isDisabled;

  descendantsAllSelected(node: CategoryNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  descendantsPartiallySelected(node: CategoryNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  itemSelectionToggle(node: CategoryNode): void {
    this.checklistSelection.toggle(node);
    if (this.isMultiple) {
      const descendants = this.treeControl.getDescendants(node);
      descendants?.length && this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
      this.checkAllParentsSelection(node);
    }

    this.value = this.checklistSelection.selected
      .filter(n => !n.expandable)
      .map(n => n.item);

    this.onTouch(this.val);
  }

  private transform = (node: JobCategory, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode?.item === node ? existingNode : new CategoryNode();
    flatNode.item = node;
    flatNode.level = level;
    flatNode.expandable = node.subCategories?.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  private checkAllParentsSelection(node: CategoryNode): void {
    let parent: CategoryNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  private checkRootNodeSelection(node: CategoryNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  private getParentNode(node: CategoryNode): CategoryNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}