const app = new Vue({
  el: "#app",
  data: {
    errors: [],
    name: "",
    surname: "",
    birthday: "",
    city: "",
    email: "",
    phone: "",
    whyLearn: "",
    skill: "",
    step: 1,
    totalSteps: 8,
    ques: "",
    ans: "",

    skills: [
      "JavaScript",
      "CSS",
      "PHP",
      "C++",
      "C#",
      "Java",
      "Ruby",
      "Python",
      "Swift",
      "Go",
      "Perl",
      "SQL"
    ],

    questions: {
      "1":
        "The day before yesterday was Saturday. What day will it be the day after tomorrow?",
      "2": "What day will be 61 days after today, if today is Monday?",
      "3":
        "Pipe P can fill a tank in 4 hours, pipe Q in 8 hours and pipe R in 24 hours. If all the pipes are open, in how many hours will the tank be filled?"
    },

    answers: {
      "1": ["Tuesday", "Wednesday", "Thursday", "Friday"],
      "2": ["Tuesday", "Thursday", "Saturday", "Friday"],
      "3": ["2 hours", "2.4 hours", "3 hours", "3.5 hours"]
    }
  },

  methods: {

     previousStep() {
      this.step--;
      this.ques--;
      this.ans--;
      this.answered = false;
    },

    sendInquiry() {
      alert("Thank you! Your application form has been submitted!");
    },
  
    validate() {
      switch (this.step) {
        case 1:
          this.checkForm();
          break;
        case 2:
          this.checkWhyLearn();
          break;
        case 3:
          this.step++;
          break;
        case 4:
              this.ques = 1;
          this.ans = 1;
          this.step++;
          break;
        case 5:
                  this.ques++;
          this.ans++;
          this.step++;
          break;
        case 6:
              this.ques++;
          this.ans++;
          this.step++;
          break;
        case 7:
          this.step++;
          this.sendInquiry();
          break;
      }
    },

    checkForm: function(e) {
      if (
        this.name &&
        this.surname &&
        this.phone &&
        this.email &&
        this.city &&
        this.birthday
      ) {
        this.errors = [];
        this.step++;
      } else {
        this.errors = [];

        if (!this.name) {
          this.errors.push("Name required!");
        }
        if (!this.surname) {
          this.errors.push("Surname required!");
        }
        if (!this.phone) {
          this.errors.push("Phone number required!");
        }
        if (!this.email) {
          this.errors.push("E-mail required!");
        }
        if (!this.city) {
          this.errors.push("City required!");
        }
        if (!this.birthday) {
          this.errors.push("Birthday required!");
        }
        e.preventDefault();
      }
    },

    checkWhyLearn: function(e) {
      if (this.whyLearn) {
        this.errors = [];
        this.step++;
      } else {
        this.errors = [];

        if (!this.whyLearn) {
          this.errors.push(
            "Please write couple sentences why you would like to learn coding!"
          );
        }
        e.preventDefault();
      }
    }
  }
});
