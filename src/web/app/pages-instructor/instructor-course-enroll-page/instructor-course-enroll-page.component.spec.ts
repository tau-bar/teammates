import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HotTableModule } from '@handsontable/angular';
import { of } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { StudentService } from '../../../services/student.service';
import { Course, HasResponses, JoinState, Student, Students } from '../../../types/api-output';
import { AjaxLoadingModule } from '../../components/ajax-loading/ajax-loading.module';
import { AjaxPreloadModule } from '../../components/ajax-preload/ajax-preload.module';
import { LoadingRetryModule } from '../../components/loading-retry/loading-retry.module';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';
import { PanelChevronModule } from '../../components/panel-chevron/panel-chevron.module';
import { ProgressBarModule } from '../../components/progress-bar/progress-bar.module';
import { StatusMessageModule } from '../../components/status-message/status-message.module';
import { InstructorCourseEnrollPageComponent } from './instructor-course-enroll-page.component';

const testCourse: Course = {
  courseId: 'exampleId',
  courseName: 'CS3281',
  institute: 'Test Institute',
  timeZone: 'UTC (UTC)',
  creationTimestamp: 0,
  deletionTimestamp: 1000,
};

const mockStudents: Students = {
  students: [
    {
      email: 'alice@example.com',
      courseId: 'CS3281',
      name: 'Alice',
      joinState: JoinState.JOINED,
      teamName: 'Team 1',
      sectionName: 'Section 1',
    },
    {
      email: 'bob@example.com',
      courseId: 'CS3281',
      name: 'Bob',
      joinState: JoinState.JOINED,
      teamName: 'Team 1',
      sectionName: 'Section 1',
    },
    {
      email: 'chloe@example.com',
      courseId: 'CS3281',
      name: 'Chloe',
      joinState: JoinState.JOINED,
      teamName: 'Team 1',
      sectionName: 'Section 2',
    },
    {
      email: 'david@example.com',
      courseId: 'CS3282',
      name: 'David',
      joinState: JoinState.JOINED,
      teamName: 'Team 1',
      sectionName: 'Section 2',
    },
  ],
};

const mockStudent: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const cloneMockStudent: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const mockStudentDiffEmail: Student = {
  email: 'ace@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const mockStudentDiffCourseId: Student = {
  email: 'alice@example.com',
  courseId: 'CS3381',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const mockStudentDiffName: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Ace',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const mockStudentDiffJoinState: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.NOT_JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 1',
};

const mockStudentDiffTeamName: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 3',
  sectionName: 'Section 1',
};

const mockStudentDiffSectionName: Student = {
  email: 'alice@example.com',
  courseId: 'CS3281',
  name: 'Alice',
  joinState: JoinState.JOINED,
  teamName: 'Team 1',
  sectionName: 'Section 2',
};

const capsMockText = 'Test';
const uncapsMockText = 'test';

const testHasResponses: HasResponses = {
  hasResponses: true,
  hasResponsesBySession: { 'First Session': false, 'Second Session': true },
};

describe('InstructorCourseEnrollPageComponent', () => {
  let component: InstructorCourseEnrollPageComponent;
  let fixture: ComponentFixture<InstructorCourseEnrollPageComponent>;
  let courseService: CourseService;
  let studentService: StudentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorCourseEnrollPageComponent],
      imports: [
        HttpClientTestingModule,
        HotTableModule,
        RouterTestingModule,
        AjaxPreloadModule,
        AjaxLoadingModule,
        StatusMessageModule,
        ProgressBarModule,
        LoadingSpinnerModule,
        LoadingRetryModule,
        PanelChevronModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseEnrollPageComponent);
    component = fixture.componentInstance;
    courseService = TestBed.inject(CourseService);
    studentService = TestBed.inject(StudentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle show new students when toggled', () => {
    component.isNewStudentsPanelCollapsed = true;
    component.toggleNewStudentsPanel();
    fixture.detectChanges();
    expect(component.isNewStudentsPanelCollapsed).toBeFalsy();
  });

  it('should show that students are the same', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, cloneMockStudent)).toBeTruthy();
  });

  it('should show that students with different emails are different', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffEmail)).toBeFalsy();
  });

  it('should show that students with different course id are same', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffCourseId)).toBeTruthy();
  });

  it('should show that students with different names are different', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffName)).toBeFalsy();
  });

  it('should show that students with different join state are same', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffJoinState)).toBeTruthy();
  });

  it('should show that students with different team names are different', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffTeamName)).toBeFalsy();
  });

  it('should show that students with different section names are different', () => {
    // @ts-ignore
    expect(component.isSameEnrollInformation(mockStudent, mockStudentDiffSectionName)).toBeFalsy();
  });

  it('should uncapitalize first letter', () => {
    const result = component.unCapitalizeFirstLetter(capsMockText);
    expect(result).toEqual(uncapsMockText);
  });

  it('should return empty string', () => {
    const result = component.unCapitalizeFirstLetter('');
    expect(result).toEqual('');
  });

  it('should show that course is present if there is a response', () => {
    jest.spyOn(courseService, 'hasResponsesForCourse').mockReturnValue(of(testHasResponses));
    jest.spyOn(studentService, 'getStudentsFromCourse').mockReturnValue(of(mockStudents));

    component.getCourseEnrollPageData(testCourse.courseId);
    fixture.detectChanges();

    expect(component.coursePresent).toBe(true);
    expect(component.courseId).toBe(testCourse.courseId);
    expect(component.existingStudents).toBe(mockStudents.students);
  });
});
