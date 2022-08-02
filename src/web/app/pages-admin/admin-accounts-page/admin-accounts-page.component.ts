import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../../../services/account.service';
import { CourseService } from '../../../services/course.service';
import { InstructorService } from '../../../services/instructor.service';
import { NavigationService } from '../../../services/navigation.service';
import { SimpleModalService } from '../../../services/simple-modal.service';
import { StatusMessageService } from '../../../services/status-message.service';git 
import { StudentService } from '../../../services/student.service';
import { Account, Course, Courses } from '../../../types/api-output';
import { SimpleModalType } from '../../components/simple-modal/simple-modal-type';
import { ErrorMessageOutput } from '../../error-message-output';

/**
 * Admin accounts page.
 */
@Component({
  selector: 'tm-admin-accounts-page',
  templateUrl: './admin-accounts-page.component.html',
  styleUrls: ['./admin-accounts-page.component.scss'],
})
export class AdminAccountsPageComponent implements OnInit {

  instructorCourses: Course[] = [];
  studentCourses: Course[] = [];
  accountInfo: Account = {
    googleId: '',
    name: '',
    email: '',
    readNotifications: {},
  };

  isLoadingAccountInfo: boolean = false;
  isLoadingStudentCourses: boolean = false;
  isLoadingInstructorCourses: boolean = false;

  constructor(private route: ActivatedRoute,
              private instructorService: InstructorService,
              private studentService: StudentService,
              private navigationService: NavigationService,
              private statusMessageService: StatusMessageService,
              private accountService: AccountService,
              private simpleModalService: SimpleModalService,
              private courseService: CourseService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.loadAccountInfo(queryParams.instructorid);
    });
  }

  /**
   * Loads the account information based on the given ID.
   */
  loadAccountInfo(instructorid: string): void {
    this.isLoadingAccountInfo = true;
    this.accountService.getAccount(instructorid)
        .pipe(finalize(() => {
          this.isLoadingAccountInfo = false;
        }))
        .subscribe((resp: Account) => {
          this.accountInfo = resp;
        }, (resp: ErrorMessageOutput) => {
          this.statusMessageService.showErrorToast(resp.error.message);
        });

    this.isLoadingStudentCourses = true;
    this.courseService.getStudentCoursesInMasqueradeMode(instructorid)
        .pipe(finalize(() => {
          this.isLoadingStudentCourses = false;
        }))
        .subscribe((resp: Courses) => {
          this.studentCourses = resp.courses;
        }, (resp: ErrorMessageOutput) => {
          if (resp.status !== 403) {
            this.statusMessageService.showErrorToast(resp.error.message);
          }
        });

    this.isLoadingInstructorCourses = true;
    this.courseService.getInstructorCoursesInMasqueradeMode(instructorid)
        .pipe(finalize(() => {
          this.isLoadingInstructorCourses = false;
        }))
        .subscribe((resp: Courses) => {
          this.instructorCourses = resp.courses;
        }, (resp: ErrorMessageOutput) => {
          if (resp.status !== 403) {
            this.statusMessageService.showErrorToast(resp.error.message);
          }
        });
  }

  /**
   * Deletes the entire account.
   */
  deleteAccount(): void {
    const id: string = this.accountInfo.googleId;
    this.accountService.deleteAccount(id).subscribe(() => {
      this.navigationService.navigateWithSuccessMessage('/web/admin/search',
          `Account "${id}" is successfully deleted.`);
    }, (resp: ErrorMessageOutput) => {
      this.statusMessageService.showErrorToast(resp.error.message);
    });
  }

  /**
   * Removes the student from course.
   */
  removeStudentFromCourse(courseId: string): void {
    this.studentService.deleteStudent({
      courseId,
      googleId: this.accountInfo.googleId,
    }).subscribe(() => {
      this.studentCourses = this.studentCourses.filter((course: Course) => course.courseId !== courseId);
      this.statusMessageService.showSuccessToast(`Student is successfully deleted from course "${courseId}"`);
    }, (resp: ErrorMessageOutput) => {
      this.statusMessageService.showErrorToast(resp.error.message);
    });
  }

  /**
   * Removes the instructor from course.
   */
   removeInstructorFromCourse(courseId: string): Promise<void> {
    const modalRef: NgbModalRef = this.simpleModalService.openConfirmationModal(
      'Warning: This instructor will be permanently deleted from this course.',
      SimpleModalType.WARNING, 'Are you sure you want to continue?');
    return modalRef.result.then(() => {
      this.instructorService.deleteInstructor({
        courseId,
        instructorId: this.accountInfo.googleId,
      }).subscribe(() => {
        this.instructorCourses = this.instructorCourses.filter((course: Course) => course.courseId !== courseId);
        this.statusMessageService.showSuccessToast(`Instructor is successfully deleted from course "${courseId}"`);
      }, (resp: ErrorMessageOutput) => {
        this.statusMessageService.showErrorToast(resp.error.message);
      });
      }).catch(() => {});
  }
}
