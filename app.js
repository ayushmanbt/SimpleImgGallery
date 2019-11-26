//getting the image gallery from the documents
let image_gallery = document.getElementsByClassName("images")[0];
let global_viewer = document.getElementById("global_viewer");
let full_screen_image = document.getElementById("full-screen-view");
let images_list = Array.from(image_gallery.children);
let current_index = 0;
let max_index = images_list.length;

//responsible to close the fullscreen view
function closeViewer() {
  global_viewer.style.visibility = "hidden";
  global_viewer.style.opacity = 0;
}

//responsible for the one by one load animation
images_list.forEach((e, i) => {
  e.children[0].onload = function() {
    e.style.animationPlayState = "running";
    e.style.animationDelay = (0 + i) / 3 + "s";
    e.addEventListener("click", e => {
      showViewer(i);
    });
  };
});

//responsible for loading the image in full screen
function showViewer(i) {
  //   console.log(images_list[i].children[0].src);
  full_screen_image.src = images_list[i].children[0].src;
  global_viewer.style.visibility = "visible";
  global_viewer.style.opacity = 1;
  current_index = i;
}

//responsile for previous and next
function left() {
  closeViewer();
  if (current_index === 0) {
    current_index = max_index - 1;
  } else {
    current_index -= 1;
  }

  showViewer(current_index);
}

function right() {
  closeViewer();
  if (current_index === max_index - 1) {
    current_index = 0;
  } else {
    current_index += 1;
  }
  showViewer(current_index);
}

//Lazy Loading the images
document.addEventListener("DOMContentLoaded", () => {
  var LazyImages;
  if ("IntersectionObserver" in window) {
    LazyImages = images_list;
    var Observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          var image = entry.target.children[0];
          image.src = image.dataset.src;
          Observer.unobserve(entry.target);
        }
      });
    });

    LazyImages.forEach(img => {
      Observer.observe(img);
    });
  }

  //fallback option for those browsers where there is no lazy load
  else {
    var lazyloadThrottleTimeout;
    lazyloadImages = images_list;

    function lazyload() {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
          }
        });
        if (lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
});
