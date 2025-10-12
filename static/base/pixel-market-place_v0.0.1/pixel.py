import html
import sys
import json
import math
import webbrowser
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QHBoxLayout, QLabel, QPushButton, QScrollArea, QFrame,
    QStackedWidget, QGridLayout, QMessageBox, QSpacerItem, QSizePolicy,
    QTextEdit, QLineEdit, QGraphicsDropShadowEffect
)
from PyQt5.QtCore import Qt, pyqtSignal, QSize, QUrl, QTimer
from PyQt5.QtGui import QPalette, QColor, QFont, QDesktopServices, QPixmap


# --- UI Constants ---
class AppColors:
    PRIMARY_BACKGROUND = QColor("#0B0F1E")
    SECONDARY_BACKGROUND = QColor("#121A30")
    CONTENT_BACKGROUND = QColor("#1A2340")
    CONTENT_BACKGROUND_LIGHTER = QColor("#222B4A")
    BORDER_COLOR = QColor("#3A4A7F")
    BORDER_COLOR_LIGHT = QColor("#5A6A9F")  # Lighter border for hover/focus
    ACCENT_PRIMARY = QColor("#00E5FF")  # Cyan
    ACCENT_SECONDARY = QColor("#FF00E5")  # Magenta
    TEXT_PRIMARY = QColor("#E0E5EC")
    TEXT_SECONDARY = QColor("#A0A5AF")
    TEXT_TERTIARY = QColor("#707A8F")
    TEXT_ON_ACCENT = QColor("#0B0F1E")
    SUCCESS = QColor("#7DFB00")
    WARNING = QColor("#FFC107")
    ERROR = QColor("#DC3545")
    DISABLED_BUTTON_BG = QColor("#404A5F")
    DISABLED_BUTTON_TEXT = QColor("#808A9F")
    SHADOW_COLOR = QColor(0, 0, 0, 60)  # Softer shadow


class AppFonts:
    FAMILY = "Segoe UI, Arial, sans-serif"  # Ensure Segoe UI is widely available or provide fallbacks
    TITLE_XL = QFont(FAMILY, 24, QFont.Bold)
    TITLE_L = QFont(FAMILY, 20, QFont.Bold)
    TITLE_M = QFont(FAMILY, 16, QFont.Bold)
    TITLE_S = QFont(FAMILY, 14, QFont.Bold)
    TEXT_DEFAULT = QFont(FAMILY, 11)
    TEXT_SMALL = QFont(FAMILY, 10)
    TEXT_TINY = QFont(FAMILY, 9)


class AppIcons:
    DISCOVER = "🌐"
    CATEGORIES = "📚"
    MY_APPS = "💻"
    PROFILE = "👤"
    SEARCH = "🔍"
    BACK = "❮"
    GET = "⬇️"
    INSTALLED = "✔️"
    OPEN_LINK = "🔗"
    INFO = "ℹ️"
    PLACEHOLDER = "📦"
    SCREENSHOT = "🖼️"
    DOWNLOAD = "📥"
    SETTINGS = "⚙️"
    CLEAR_SEARCH = "❌"  # For potential clear search button


# --- Helper Functions ---
def load_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        QMessageBox.critical(None, "Error", f"Critical file not found: {file_path}.")
        return None
    except json.JSONDecodeError:
        QMessageBox.critical(None, "Error", f"Could not decode JSON from {file_path}.")
        return None


def format_size(size_bytes):
    if not isinstance(size_bytes, (int, float)) or size_bytes < 0: return "N/A"
    if size_bytes == 0: return "0 B"
    names = ("B", "KB", "MB", "GB", "TB")
    i = int(math.floor(math.log(size_bytes, 1024))) if size_bytes > 0 else 0
    i = min(i, len(names) - 1)
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {names[i]}"


def create_shadow_effect(color=AppColors.SHADOW_COLOR, blur_radius=18, offset=(4, 4)):
    shadow = QGraphicsDropShadowEffect()
    shadow.setBlurRadius(blur_radius)
    shadow.setColor(color)
    shadow.setOffset(offset[0], offset[1])
    return shadow


# --- Clickable Frame (Base for AppCard) ---
class ClickableFrame(QFrame):
    clicked = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setCursor(Qt.PointingHandCursor)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.clicked.emit()
        super().mousePressEvent(event)


# --- App Card ---
class AppCard(ClickableFrame):
    getAppClicked = pyqtSignal(object, QPushButton)
    viewDetailsClicked = pyqtSignal(object)

    def __init__(self, app_data, main_window_ref):
        super().__init__()
        self.app_data = app_data
        self.main_window = main_window_ref
        self.setFixedSize(280, 225)  # Slightly taller for better spacing
        self.setObjectName("AppCard")

        self.base_style = f"""
            AppCard#AppCard {{
                background-color: {AppColors.CONTENT_BACKGROUND.name()};
                border: 1px solid {AppColors.BORDER_COLOR.name()};
                border-radius: 12px;
                padding: 16px;
            }}
            AppCard#AppCard:hover {{
                background-color: {AppColors.CONTENT_BACKGROUND_LIGHTER.name()};
                border: 1px solid {AppColors.ACCENT_PRIMARY.name()};
            }}
        """
        self.setStyleSheet(self.base_style)
        self.setGraphicsEffect(create_shadow_effect(blur_radius=15, offset=(3, 3)))

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)  # Padding is handled by stylesheet
        layout.setSpacing(10)  # Increased spacing

        top_layout = QHBoxLayout()
        top_layout.setSpacing(12)
        icon_label = QLabel(app_data.get('icon', AppIcons.PLACEHOLDER))
        icon_label.setFont(QFont(AppFonts.FAMILY, 32))  # Slightly larger icon
        icon_label.setFixedSize(50, 50)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet(
            f"color: {AppColors.ACCENT_SECONDARY.name()}; background-color: {AppColors.SECONDARY_BACKGROUND.name()}; border-radius: 8px;")

        title_dev_layout = QVBoxLayout()
        title_dev_layout.setSpacing(3)
        title_label = QLabel(app_data['title'])
        title_label.setFont(AppFonts.TITLE_S)
        title_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; font-weight: 600;")
        title_label.setWordWrap(True)

        developer_label = QLabel(app_data.get('developer', 'Unknown Developer'))
        developer_label.setFont(AppFonts.TEXT_TINY)
        developer_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()};")

        title_dev_layout.addWidget(title_label)
        title_dev_layout.addWidget(developer_label)

        top_layout.addWidget(icon_label)
        top_layout.addLayout(title_dev_layout)
        top_layout.addStretch()
        layout.addLayout(top_layout)

        desc_label = QLabel(app_data.get('short_desc', ''))
        desc_label.setFont(AppFonts.TEXT_SMALL)
        desc_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()};")
        desc_label.setWordWrap(True)
        desc_label.setFixedHeight(42)  # Approx 2-3 lines
        desc_label.setAlignment(Qt.AlignTop)
        layout.addWidget(desc_label)

        layout.addStretch(1)

        bottom_layout = QHBoxLayout()
        category_label = QLabel(app_data.get('category', 'N/A'))
        category_label.setFont(AppFonts.TEXT_TINY)
        category_label.setStyleSheet(
            f"color: {AppColors.TEXT_TERTIARY.name()}; background-color: {AppColors.SECONDARY_BACKGROUND.name()};"
            f"border-radius: 5px; padding: 3px 6px;")

        self.get_button = QPushButton()
        self.get_button.setFont(AppFonts.TEXT_SMALL)
        self.get_button.setFixedHeight(32)
        self.get_button.setCursor(Qt.PointingHandCursor)
        self.get_button.setObjectName("GetButton")
        self.update_button_state()
        self.get_button.clicked.connect(self.on_get_app_clicked)

        bottom_layout.addWidget(category_label)
        bottom_layout.addStretch()
        bottom_layout.addWidget(self.get_button)
        layout.addLayout(bottom_layout)

        self.clicked.connect(lambda: self.viewDetailsClicked.emit(self.app_data))

    def on_get_app_clicked(self):
        self.getAppClicked.emit(self.app_data, self.get_button)

    def update_button_state(self):
        status = self.main_window.get_app_status(self.app_data['id'])
        base_style = "padding: 5px 12px; border-radius: 6px; border: none; font-weight: 600;"

        if self.app_data.get("isDecoy"):
            self.get_button.setText(f"{AppIcons.OPEN_LINK} Visit Site")
            self.get_button.setStyleSheet(f"""
                QPushButton#GetButton {{ {base_style} background-color: {AppColors.WARNING.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                QPushButton#GetButton:hover {{ background-color: {AppColors.WARNING.lighter(120).name()}; }}
            """)
            self.get_button.setEnabled(True)
        elif status == "installed":
            self.get_button.setText(f"{AppIcons.INSTALLED} Installed")
            self.get_button.setStyleSheet(f"""
                QPushButton#GetButton {{ {base_style} background-color: {AppColors.SUCCESS.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                QPushButton#GetButton:hover {{ background-color: {AppColors.SUCCESS.darker(110).name()}; }} /* Darker for installed btn hover */
            """)
            self.get_button.setEnabled(False)
        elif status == "getting":
            self.get_button.setText(f"{AppIcons.DOWNLOAD} Acquiring...")
            self.get_button.setStyleSheet(f"""
                QPushButton#GetButton {{ {base_style} background-color: {AppColors.DISABLED_BUTTON_BG.name()}; color: {AppColors.DISABLED_BUTTON_TEXT.name()}; }}
            """)
            self.get_button.setEnabled(False)
        else:
            self.get_button.setText(f"{AppIcons.GET} Get")
            self.get_button.setStyleSheet(f"""
                QPushButton#GetButton {{ {base_style} background-color: {AppColors.ACCENT_PRIMARY.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                QPushButton#GetButton:hover {{ background-color: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
            """)
            self.get_button.setEnabled(True)


# --- Breadcrumb Bar ---
class BreadcrumbBar(QWidget):
    navigate = pyqtSignal(object)  # Can emit key or index

    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QHBoxLayout(self)
        self.layout.setContentsMargins(0, 0, 0, 0)
        self.layout.setSpacing(0)
        self.layout.setAlignment(Qt.AlignLeft)
        self.items = []
        self.setStyleSheet(f"""
            QLabel, QPushButton {{
                font-size: {AppFonts.TEXT_DEFAULT.pointSize()}pt;
                padding: 4px 6px; /* Consistent padding */
            }}
            QPushButton {{
                color: {AppColors.ACCENT_PRIMARY.name()};
                border: none;
                background: transparent;
                font-weight: 500;
            }}
            QPushButton:hover {{
                text-decoration: underline;
                color: {AppColors.ACCENT_PRIMARY.lighter(120).name()};
            }}
        """)

    def set_crumbs(self, crumbs_list_of_tuples):
        while self.layout.count():
            child = self.layout.takeAt(0)
            if child.widget():
                child.widget().deleteLater()
        self.items = []

        for i, (text, page_identifier) in enumerate(crumbs_list_of_tuples):  # page_identifier can be key or index
            self.items.append((text, page_identifier))
            if i > 0:
                separator = QLabel("❯")
                separator.setStyleSheet(f"color: {AppColors.TEXT_TERTIARY.name()}; padding: 4px 8px;")
                self.layout.addWidget(separator)

            if page_identifier is None or page_identifier == -1:
                label = QLabel(text)
                label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; font-weight: bold;")
                self.layout.addWidget(label)
            else:
                btn = QPushButton(text)
                btn.setCursor(Qt.PointingHandCursor)
                btn.clicked.connect(lambda checked=False, p_id=page_identifier: self.navigate.emit(p_id))
                self.layout.addWidget(btn)
        self.layout.addStretch()


# --- App List Page ---
class AppListPageWidget(QWidget):
    def __init__(self, all_apps_data, main_window_ref, filter_category=None, initial_search_term=""):
        super().__init__()
        self.all_apps_data = all_apps_data
        self.main_window = main_window_ref
        self.filter_category = filter_category
        self.current_search_term = initial_search_term.lower()
        self.cards = []

        self.setObjectName("AppListPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 25, 30, 25)  # More consistent margins
        layout.setSpacing(20)

        header_layout = QHBoxLayout()
        page_title_text = "Discover Apps"
        if self.filter_category:
            page_title_text = f"Category: {self.filter_category}"

        self.page_title = QLabel(page_title_text)
        self.page_title.setFont(AppFonts.TITLE_L)
        self.page_title.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()};")
        header_layout.addWidget(self.page_title)
        header_layout.addStretch()

        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText(f"{AppIcons.SEARCH} Search...")
        self.search_input.setFont(AppFonts.TEXT_DEFAULT)
        self.search_input.setFixedHeight(40)
        self.search_input.setFixedWidth(300)
        self.search_input.setStyleSheet(f"""
            QLineEdit {{
                background-color: {AppColors.SECONDARY_BACKGROUND.name()};
                border: 1px solid {AppColors.BORDER_COLOR.name()};
                border-radius: 8px;
                padding: 0px 12px 0px 35px; /* Left padding for icon */
                color: {AppColors.TEXT_PRIMARY.name()};
                selection-background-color: {AppColors.ACCENT_PRIMARY.name()};
                selection-color: {AppColors.TEXT_ON_ACCENT.name()};
            }}
            QLineEdit:focus {{
                border: 1px solid {AppColors.ACCENT_PRIMARY.name()};
                background-color: {AppColors.CONTENT_BACKGROUND.name()};
            }}
        """)
        # Search icon inside QLineEdit (visual only, not clickable)
        search_icon_label = QLabel(AppIcons.SEARCH, self.search_input)
        search_icon_label.setStyleSheet(
            f"color: {AppColors.TEXT_TERTIARY.name()}; padding-left: 10px; background: transparent; border: none;")
        search_icon_label.setFont(AppFonts.TEXT_DEFAULT)
        search_icon_label.move(10, (self.search_input.height() - search_icon_label.fontMetrics().height()) // 2)

        self.search_input.textChanged.connect(self.filter_apps_by_search)
        if initial_search_term:
            self.search_input.setText(initial_search_term)
        header_layout.addWidget(self.search_input)
        layout.addLayout(header_layout)

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setStyleSheet(
            f"QScrollArea {{ border: none; background-color: {AppColors.PRIMARY_BACKGROUND.name()}; }}")  # Match page bg

        self.content_widget = QWidget()
        self.content_widget.setStyleSheet(
            f"background-color: {AppColors.PRIMARY_BACKGROUND.name()};")  # Ensure bg consistency
        self.app_grid_layout = QGridLayout(self.content_widget)
        self.app_grid_layout.setSpacing(25)  # Increased spacing
        self.app_grid_layout.setAlignment(Qt.AlignTop | Qt.AlignLeft)

        self.scroll_area.setWidget(self.content_widget)
        layout.addWidget(self.scroll_area)

        QTimer.singleShot(0, self.display_apps)  # Initial display after layout established

    def display_apps(self):
        while self.app_grid_layout.count():
            item = self.app_grid_layout.takeAt(0)
            if item:
                widget = item.widget()
                if widget:
                    widget.deleteLater()
        self.cards = []

        apps_to_display = []
        for app_data in self.all_apps_data:
            passes_category_filter = (not self.filter_category or app_data.get('category') == self.filter_category)
            search_text = self.current_search_term
            passes_search_filter = (not search_text or
                                    search_text in app_data['title'].lower() or
                                    search_text in app_data.get('short_desc', '').lower() or
                                    search_text in app_data.get('developer', '').lower())
            if passes_category_filter and passes_search_filter:
                apps_to_display.append(app_data)

        if not apps_to_display:
            no_apps_label = QLabel(f"{AppIcons.INFO} No apps found.")
            if self.current_search_term and not self.filter_category:
                no_apps_label.setText(f"{AppIcons.INFO} No apps match '{self.current_search_term}'.")
            elif self.filter_category and not self.current_search_term:
                no_apps_label.setText(f"{AppIcons.INFO} No apps in category '{self.filter_category}'.")
            elif self.filter_category and self.current_search_term:
                no_apps_label.setText(
                    f"{AppIcons.INFO} No apps match '{self.current_search_term}' in '{self.filter_category}'.")

            no_apps_label.setFont(AppFonts.TEXT_DEFAULT)
            no_apps_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()}; padding: 40px;")
            no_apps_label.setAlignment(Qt.AlignCenter)
            self.app_grid_layout.addWidget(no_apps_label, 0, 0, 1, self.get_num_columns())
            self.content_widget.adjustSize()
            return

        num_columns = self.get_num_columns()
        for i, app_data in enumerate(apps_to_display):
            card = AppCard(app_data, self.main_window)
            card.getAppClicked.connect(self.main_window.handle_get_app_action)
            card.viewDetailsClicked.connect(self.main_window.show_app_detail_page)
            self.cards.append(card)
            row = i // num_columns
            col = i % num_columns
            self.app_grid_layout.addWidget(card, row, col)

        # This ensures the grid layout doesn't leave large empty spaces below if the content is short.
        # However, AlignTop | AlignLeft should mostly handle this.
        # If issues persist, we might add a vertical spacer to the main QVBoxLayout of AppListPageWidget
        # after the scroll_area, but that's usually not needed if scroll_area is the expanding element.

        self.content_widget.adjustSize()  # Crucial for scroll area

    def filter_apps_by_search(self, term):
        self.current_search_term = term.lower()
        self.display_apps()

    def get_num_columns(self):
        width = self.scroll_area.viewport().width() if self.scroll_area.viewport() else self.width()
        # AppCard width (280) + grid spacing (25)
        card_width_plus_spacing = 280 + self.app_grid_layout.spacing()
        if card_width_plus_spacing <= 0: card_width_plus_spacing = 305  # Fallback
        num_cols = max(1, math.floor(width / card_width_plus_spacing))
        return num_cols

    def resizeEvent(self, event):
        super().resizeEvent(event)
        # Debounce display_apps call on resize
        if hasattr(self, '_resize_timer'):
            self._resize_timer.stop()
        self._resize_timer = QTimer()
        self._resize_timer.setSingleShot(True)
        self._resize_timer.timeout.connect(self.display_apps)
        self._resize_timer.start(100)  # Adjust delay as needed

    def update_all_card_buttons(self):
        for card in self.cards:
            card.update_button_state()


# --- App Detail Page ---
class AppDetailPageWidget(QWidget):
    getAppClickedInDetail = pyqtSignal(object, QPushButton)

    def __init__(self, main_window_ref):
        super().__init__()
        self.main_window = main_window_ref
        self.app_data = None
        self.setObjectName("AppDetailPage")
        self.setStyleSheet(f"QWidget#AppDetailPage {{ background-color: {AppColors.PRIMARY_BACKGROUND.name()}; }}")

        self.master_layout = QVBoxLayout(self)
        self.master_layout.setContentsMargins(0, 0, 0, 0)
        self.master_layout.setSpacing(0)

        self.breadcrumb_bar = BreadcrumbBar()
        self.breadcrumb_bar.navigate.connect(self.main_window.navigate_from_breadcrumb)
        breadcrumb_container = QWidget()
        breadcrumb_container.setFixedHeight(48)  # Taller for better visual weight
        breadcrumb_container.setStyleSheet(
            f"background-color: {AppColors.SECONDARY_BACKGROUND.name()}; padding: 0 30px; border-bottom: 1px solid {AppColors.BORDER_COLOR.name()};")
        bc_layout = QHBoxLayout(breadcrumb_container)
        bc_layout.setContentsMargins(0, 0, 0, 0)
        bc_layout.addWidget(self.breadcrumb_bar)
        self.master_layout.addWidget(breadcrumb_container)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet(f"QScrollArea {{ border: none; background-color: transparent; }}")
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)

        content_widget = QWidget()
        layout = QVBoxLayout(content_widget)
        layout.setContentsMargins(35, 30, 35, 30)
        layout.setSpacing(28)  # Increased general spacing

        header_section = QHBoxLayout()
        header_section.setSpacing(25)
        self.app_icon_label = QLabel(AppIcons.PLACEHOLDER)
        self.app_icon_label.setFont(QFont(AppFonts.FAMILY, 52))
        self.app_icon_label.setFixedSize(88, 88)  # Larger icon
        self.app_icon_label.setAlignment(Qt.AlignCenter)
        self.app_icon_label.setStyleSheet(
            f"color: {AppColors.ACCENT_SECONDARY.name()}; background-color: {AppColors.CONTENT_BACKGROUND.name()}; border-radius: 14px;")

        title_area = QVBoxLayout()
        title_area.setSpacing(4)
        self.app_title_label = QLabel("App Title")
        self.app_title_label.setFont(AppFonts.TITLE_XL)
        self.app_title_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()};")
        self.app_title_label.setWordWrap(True)

        self.app_developer_label = QLabel("Developer Name")
        self.app_developer_label.setFont(AppFonts.TEXT_DEFAULT)
        self.app_developer_label.setCursor(Qt.PointingHandCursor)  # Hint it might be clickable
        self.app_developer_label.setStyleSheet(f"""
            color: {AppColors.ACCENT_PRIMARY.name()};
            text-decoration: none; /* No underline by default */
            &:hover {{ text-decoration: underline; color: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
        """)

        title_area.addWidget(self.app_title_label)
        title_area.addWidget(self.app_developer_label)
        title_area.addStretch()

        self.get_button_detail = QPushButton(f"{AppIcons.GET} Get")
        self.get_button_detail.setFont(AppFonts.TITLE_S)  # Using TITLE_S for prominence
        self.get_button_detail.setFixedHeight(50)
        self.get_button_detail.setMinimumWidth(170)
        self.get_button_detail.setCursor(Qt.PointingHandCursor)
        self.get_button_detail.setObjectName("GetButtonDetail")
        self.get_button_detail.clicked.connect(self.emit_get_app_signal)

        header_section.addWidget(self.app_icon_label)
        header_section.addLayout(title_area)
        header_section.addStretch()
        header_section.addWidget(self.get_button_detail, 0, Qt.AlignTop)
        layout.addLayout(header_section)

        def create_section_title(text):
            title = QLabel(text)
            title.setFont(AppFonts.TITLE_M)
            title.setStyleSheet(
                f"color: {AppColors.TEXT_PRIMARY.name()}; margin-top: 10px; margin-bottom: 5px; border-bottom: 1px solid {AppColors.BORDER_COLOR.darker(120).name()}; padding-bottom: 5px;")
            return title

        layout.addWidget(create_section_title("Screenshots"))
        self.screenshots_area = QScrollArea()
        self.screenshots_area.setFixedHeight(180)  # Taller screenshots
        self.screenshots_area.setWidgetResizable(True)
        self.screenshots_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        self.screenshots_area.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.screenshots_area.setStyleSheet(f"""
            QScrollArea {{
                border: 1px solid {AppColors.BORDER_COLOR.name()};
                border-radius: 10px;
                background-color: {AppColors.SECONDARY_BACKGROUND.name()};
            }}
            /* Scrollbar styles inherited from MainWindow or define specifically here */
        """)
        screenshots_content = QWidget()
        self.screenshots_layout = QHBoxLayout(screenshots_content)
        self.screenshots_layout.setSpacing(15)
        self.screenshots_layout.setContentsMargins(10, 10, 10, 10)
        self.screenshots_layout.setAlignment(Qt.AlignLeft)
        self.screenshots_area.setWidget(screenshots_content)
        layout.addWidget(self.screenshots_area)

        layout.addWidget(create_section_title("Description"))
        self.long_desc_text = QTextEdit()
        self.long_desc_text.setReadOnly(True)
        self.long_desc_text.setFont(AppFonts.TEXT_DEFAULT)
        self.long_desc_text.setMinimumHeight(120)
        self.long_desc_text.setStyleSheet(f"""
            QTextEdit {{
                color: {AppColors.TEXT_SECONDARY.name()};
                background-color: transparent; /* Or {AppColors.SECONDARY_BACKGROUND.name()} for slight contrast */
                border: none; /* Or 1px solid {AppColors.BORDER_COLOR.name()} if boxed look is desired */
                padding: 8px;
                line-height: 150%; /* For QTextEdit, use QTextBlockFormat for line height */
            }}
        """)
        layout.addWidget(self.long_desc_text)

        layout.addWidget(create_section_title("Features"))
        self.features_list_widget = QWidget()
        self.features_layout = QVBoxLayout(self.features_list_widget)
        self.features_layout.setContentsMargins(5, 5, 0, 0)
        self.features_layout.setSpacing(8)
        layout.addWidget(self.features_list_widget)

        layout.addWidget(create_section_title("Additional Information"))
        self.info_grid_widget = QWidget()
        self.info_grid_layout = QGridLayout(self.info_grid_widget)
        self.info_grid_layout.setContentsMargins(5, 5, 0, 0)
        self.info_grid_layout.setColumnStretch(1, 1)
        self.info_grid_layout.setVerticalSpacing(12)
        self.info_grid_layout.setHorizontalSpacing(10)
        layout.addWidget(self.info_grid_widget)

        layout.addStretch(1)
        scroll.setWidget(content_widget)
        self.master_layout.addWidget(scroll)

    def _add_info_row(self, row_idx, key, value):
        key_label = QLabel(f"{key}:")
        key_label.setFont(AppFonts.TEXT_DEFAULT)
        key_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()}; font-weight: 600;")  # Bolder key
        key_label.setAlignment(Qt.AlignTop | Qt.AlignLeft)

        value_label = QLabel(str(value))
        value_label.setFont(AppFonts.TEXT_DEFAULT)
        value_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()};")
        value_label.setWordWrap(True)
        value_label.setTextInteractionFlags(Qt.TextSelectableByMouse)
        value_label.setAlignment(Qt.AlignTop | Qt.AlignLeft)

        self.info_grid_layout.addWidget(key_label, row_idx, 0)
        self.info_grid_layout.addWidget(value_label, row_idx, 1)

    def set_app_data(self, app_data):
        self.app_data = app_data
        # Determine the source page for breadcrumb (simplified)
        # This part needs robust context from where show_app_detail_page was called
        source_page_key = "Discover"  # Default
        # Example: if self.main_window.current_page_key == "Categories" or self.main_window.current_page_key == self.main_window.category_filtered_page_key:
        #    source_page_key = "Categories"

        crumbs = [("Discover", "Discover")]  # Default first crumb
        if app_data.get("category"):
            # Assuming clicking category goes to category filtered view via Categories main tab
            crumbs.append((app_data["category"], "Categories"))  # Or a more specific key if exists
        crumbs.append((app_data['title'], -1))
        self.breadcrumb_bar.set_crumbs(crumbs)

        self.app_icon_label.setText(app_data.get('icon', AppIcons.PLACEHOLDER))
        self.app_title_label.setText(app_data['title'])
        self.app_developer_label.setText(app_data.get('developer', 'Unknown Developer'))

        self.update_detail_button_state()

        while self.screenshots_layout.count():
            child = self.screenshots_layout.takeAt(0)
            if child.widget(): child.widget().deleteLater()

        screenshots = app_data.get("screenshots", [])
        if screenshots:
            for _ in screenshots:
                placeholder = QLabel(AppIcons.SCREENSHOT)
                placeholder.setFixedSize(240, 150)  # Larger placeholders
                placeholder.setAlignment(Qt.AlignCenter)
                placeholder.setFont(QFont(AppFonts.FAMILY, 40))
                placeholder.setStyleSheet(f"""
                    QLabel {{
                        background-color: {AppColors.CONTENT_BACKGROUND.darker(110).name()};
                        border-radius: 8px;
                        color: {AppColors.TEXT_TERTIARY.darker(110).name()};
                        border: 1px dashed {AppColors.BORDER_COLOR.darker(130).name()};
                    }}
                """)
                self.screenshots_layout.addWidget(placeholder)
        else:
            no_screenshots = QLabel("No screenshots available.")
            no_screenshots.setFont(AppFonts.TEXT_SMALL)
            no_screenshots.setStyleSheet(f"color: {AppColors.TEXT_TERTIARY.name()}; padding: 20px;")
            no_screenshots.setAlignment(Qt.AlignCenter)
            self.screenshots_layout.addWidget(no_screenshots)
        self.screenshots_layout.addStretch()

        long_desc_content = app_data.get('long_desc', 'N/A')
        # --- CORRECTED LONG DESCRIPTION HANDLING ---
        long_desc_content = app_data.get('long_desc', 'N/A')
        processed_desc = 'N/A'  # Default if content is not a string or is empty after processing

        if isinstance(long_desc_content, str) and long_desc_content.strip():  # Check if it's a non-empty string
            # 1. Escape HTML special characters from the user-provided content
            html_escaped_content = html.escape(long_desc_content)
            # 2. Then replace Python newlines with HTML <br> tags
            processed_desc = html_escaped_content.replace('\n', '<br>')
        elif not isinstance(long_desc_content, str):  # If it's not a string at all (e.g. None, int)
            processed_desc = 'N/A'
        # If it *is* a string but just whitespace, processed_desc remains 'N/A' from initialization

        # Construct the final HTML string for QTextEdit
        # Using <body> allows setting document-wide styles easily for QTextEdit's rich text
        # The <p> tag is good for paragraph content.
        styled_html_for_desc = f"""
                   <body style="line-height:1.6; color:{AppColors.TEXT_SECONDARY.name()};">
                       <p>{processed_desc}</p>
                   </body>
               """
        self.long_desc_text.setHtml(styled_html_for_desc)

        while self.features_layout.count():
            child = self.features_layout.takeAt(0)
            if child.widget(): child.widget().deleteLater()
        features = app_data.get('features', [])
        if features:
            for feature in features:
                feature_label = QLabel(
                    f"<span style='color:{AppColors.ACCENT_PRIMARY.name()}; font-size:1.2em;'>•</span>  {feature}")
                feature_label.setFont(AppFonts.TEXT_DEFAULT)
                feature_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()}; padding-left: 8px;")
                feature_label.setWordWrap(True)
                self.features_layout.addWidget(feature_label)
        else:
            no_features_label = QLabel("No specific features listed.")
            no_features_label.setFont(AppFonts.TEXT_SMALL)
            no_features_label.setStyleSheet(f"color: {AppColors.TEXT_TERTIARY.name()};")
            self.features_layout.addWidget(no_features_label)

        while self.info_grid_layout.count():
            child = self.info_grid_layout.takeAt(0)
            if child.widget(): child.widget().deleteLater()
        info_items = [
            ("Version", app_data.get('version', 'N/A')),
            ("Category", app_data.get('category', 'N/A')),
            ("Released", app_data.get('release_date', 'N/A')),
            ("Size", format_size(app_data.get('size_bytes', 0))),  # Default to 0 if N/A
            ("Updated", app_data.get('last_updated', 'N/A'))
        ]
        for idx, (key, value) in enumerate(info_items):
            if value not in ['N/A', '', None, '0 B']:  # Only show if value exists
                self._add_info_row(idx, key, value)

        self.info_grid_widget.adjustSize()
        QTimer.singleShot(0, lambda: self.long_desc_text.setFixedHeight(
            min(300, self.long_desc_text.document().size().height() + 15)  # Max height for desc
        ))
        # Scroll to top of detail page
        parent_scroll_area = self.parentWidget().parentWidget()  # scroll -> content_widget -> AppDetailPageWidget
        if isinstance(parent_scroll_area, QScrollArea):
            parent_scroll_area.verticalScrollBar().setValue(0)

    def update_detail_button_state(self):
        if not self.app_data: return
        status = self.main_window.get_app_status(self.app_data['id'])
        base_style = "padding: 0 22px; border-radius: 8px; border: none; font-weight: bold;"

        if self.app_data.get("isDecoy"):
            self.get_button_detail.setText(f"{AppIcons.OPEN_LINK} Visit Site")
            self.get_button_detail.setStyleSheet(f"""
                QPushButton#GetButtonDetail {{ {base_style} background-color: {AppColors.WARNING.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                QPushButton#GetButtonDetail:hover {{ background-color: {AppColors.WARNING.lighter(120).name()}; }}
            """)
            self.get_button_detail.setEnabled(True)
        elif status == "installed":
            self.get_button_detail.setText(f"{AppIcons.INSTALLED} Installed")
            self.get_button_detail.setStyleSheet(f"""
                 QPushButton#GetButtonDetail {{ {base_style} background-color: {AppColors.SUCCESS.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                 QPushButton#GetButtonDetail:hover {{ background-color: {AppColors.SUCCESS.darker(110).name()}; }}
            """)
            self.get_button_detail.setEnabled(False)
        elif status == "getting":
            self.get_button_detail.setText(f"{AppIcons.DOWNLOAD} Acquiring...")
            self.get_button_detail.setStyleSheet(f"""
                QPushButton#GetButtonDetail {{ {base_style} background-color: {AppColors.DISABLED_BUTTON_BG.name()}; color: {AppColors.DISABLED_BUTTON_TEXT.name()}; }}
            """)
            self.get_button_detail.setEnabled(False)
        else:
            self.get_button_detail.setText(f"{AppIcons.GET} Get")
            self.get_button_detail.setStyleSheet(f"""
                QPushButton#GetButtonDetail {{ {base_style} background-color: {AppColors.ACCENT_PRIMARY.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                QPushButton#GetButtonDetail:hover {{ background-color: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
            """)
            self.get_button_detail.setEnabled(True)

    def emit_get_app_signal(self):
        if self.app_data:
            self.getAppClickedInDetail.emit(self.app_data, self.get_button_detail)


# --- Categories Page ---
class CategoriesPageWidget(QWidget):
    categorySelected = pyqtSignal(str)

    def __init__(self, apps_data, main_window_ref):
        super().__init__()
        self.apps_data = apps_data
        self.main_window_ref = main_window_ref

        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 25, 30, 25)
        layout.setSpacing(20)

        title = QLabel("App Categories")
        title.setFont(AppFonts.TITLE_L)
        title.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; padding-bottom: 10px;")
        layout.addWidget(title)

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setStyleSheet(
            f"QScrollArea {{ border: none; background-color: {AppColors.PRIMARY_BACKGROUND.name()}; }}")

        content_widget = QWidget()
        content_widget.setStyleSheet(f"background-color: {AppColors.PRIMARY_BACKGROUND.name()};")
        self.grid_layout = QGridLayout(content_widget)
        self.grid_layout.setSpacing(25)
        self.grid_layout.setAlignment(Qt.AlignTop | Qt.AlignLeft)

        # ***** FIX: Move this line before calling populate_categories *****
        self.scroll_area.setWidget(content_widget)
        # ***** END FIX *****

        self.populate_categories()  # Now populate_categories can safely access scroll_area.widget()

        layout.addWidget(self.scroll_area)

    def populate_categories(self):
        while self.grid_layout.count():
            item = self.grid_layout.takeAt(0)
            if item and item.widget(): item.widget().deleteLater()

        categories = sorted(
            list(set(app.get('category', 'Uncategorized') for app in self.apps_data if app.get('category'))))

        num_columns = 4  # Adjust based on desired card size and spacing
        card_width = 220
        card_height = 140

        for i, cat_name in enumerate(categories):
            card = ClickableFrame()
            card.setFixedSize(card_width, card_height)
            card.setObjectName("CategoryCard")
            card.setStyleSheet(f"""
                QFrame#CategoryCard {{
                    background-color: {AppColors.CONTENT_BACKGROUND.name()};
                    border: 1px solid {AppColors.BORDER_COLOR.name()};
                    border-radius: 10px; padding: 20px;
                }}
                QFrame#CategoryCard:hover {{
                    border-color: {AppColors.ACCENT_SECONDARY.name()};
                    background-color: {AppColors.CONTENT_BACKGROUND_LIGHTER.name()};
                }}
            """)
            card.setGraphicsEffect(create_shadow_effect(blur_radius=12, offset=(2, 2)))

            cat_layout = QVBoxLayout(card)
            cat_layout.setAlignment(Qt.AlignCenter)
            cat_layout.setSpacing(10)

            icon_label = QLabel(AppIcons.CATEGORIES)
            icon_label.setFont(QFont(AppFonts.FAMILY, 34))
            icon_label.setAlignment(Qt.AlignCenter)
            icon_label.setStyleSheet(f"color: {AppColors.ACCENT_SECONDARY.name()};")

            name_label = QLabel(cat_name)
            name_label.setFont(AppFonts.TITLE_S)  # Changed to TITLE_S
            name_label.setAlignment(Qt.AlignCenter)
            name_label.setWordWrap(True)
            name_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; font-weight: 600;")

            cat_layout.addWidget(icon_label)
            cat_layout.addWidget(name_label)
            cat_layout.addStretch()

            card.clicked.connect(lambda name=cat_name: self.categorySelected.emit(name))

            row = i // num_columns
            col = i % num_columns
            self.grid_layout.addWidget(card, row, col)

        # This line should now work correctly
        if self.scroll_area.widget():  # Good practice to check, though it should be set by now
            self.scroll_area.widget().adjustSize()
# --- My Apps Page ---
class MyAppItemFrame(QFrame):  # Wrapper for styling individual app items
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setObjectName("MyAppItemFrame")
        self.setMinimumHeight(90)
        self.setStyleSheet(f"""
            QFrame#MyAppItemFrame {{
                background-color: {AppColors.CONTENT_BACKGROUND.name()};
                border: 1px solid {AppColors.BORDER_COLOR.name()};
                border-radius: 10px;
                padding: 15px 20px;
            }}
            QFrame#MyAppItemFrame:hover {{
                 background-color: {AppColors.CONTENT_BACKGROUND_LIGHTER.name()};
                 border-color: {AppColors.ACCENT_PRIMARY.name()};
            }}
        """)
        self.setGraphicsEffect(create_shadow_effect(blur_radius=10, offset=(2, 2)))


class MyAppsPageWidget(QWidget):
    def __init__(self, main_window_ref):
        super().__init__()
        self.main_window = main_window_ref
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 25, 30, 25)
        layout.setSpacing(20)
        layout.setAlignment(Qt.AlignTop)

        title_label = QLabel(f"{AppIcons.MY_APPS} My Library")
        title_label.setFont(AppFonts.TITLE_L)
        title_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; padding-bottom: 10px;")
        layout.addWidget(title_label)

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setStyleSheet(
            f"QScrollArea {{ border: none; background-color: {AppColors.PRIMARY_BACKGROUND.name()}; }}")

        self.content_widget = QWidget()
        self.content_widget.setStyleSheet(f"background-color: {AppColors.PRIMARY_BACKGROUND.name()};")
        self.items_layout = QVBoxLayout(self.content_widget)
        self.items_layout.setSpacing(18)  # Spacing between app item frames
        self.items_layout.setAlignment(Qt.AlignTop)
        self.items_layout.setContentsMargins(0, 0, 5, 0)  # Right margin for scrollbar clearance

        self.scroll_area.setWidget(self.content_widget)
        layout.addWidget(self.scroll_area)

        self.refresh_my_apps_display()

    def refresh_my_apps_display(self):
        while self.items_layout.count():
            item = self.items_layout.takeAt(0)
            if item and item.widget():
                item.widget().deleteLater()

        if not self.main_window.my_apps_state:
            no_items_label = QLabel(f"{AppIcons.INFO} Your library is empty. Discover some apps!")
            no_items_label.setFont(AppFonts.TEXT_DEFAULT)
            no_items_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()}; padding: 40px;")
            no_items_label.setAlignment(Qt.AlignCenter)
            self.items_layout.addWidget(no_items_label)
        else:
            sorted_apps = sorted(self.main_window.my_apps_state.items(),
                                 key=lambda item: item[1]['data']['title'].lower())

            for app_id, app_s_data in sorted_apps:
                app_data = app_s_data['data']
                item_frame = MyAppItemFrame()  # Use the styled wrapper frame
                item_layout = QHBoxLayout(item_frame)  # Layout for content inside the frame
                item_layout.setSpacing(18)

                icon_label = QLabel(app_data.get('icon', AppIcons.PLACEHOLDER))
                icon_label.setFont(QFont(AppFonts.FAMILY, 28))
                icon_label.setFixedSize(50, 50)
                icon_label.setAlignment(Qt.AlignCenter)
                icon_label.setStyleSheet(
                    f"color: {AppColors.ACCENT_PRIMARY.name()}; background-color: {AppColors.SECONDARY_BACKGROUND.name()}; border-radius: 8px;")

                details_layout = QVBoxLayout()
                details_layout.setSpacing(3)
                name_label = QLabel(app_data['title'])
                name_label.setFont(AppFonts.TITLE_S)  # Bolder title
                name_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; font-weight: 600;")

                status_text = app_s_data['status'].capitalize()
                status_color = AppColors.TEXT_SECONDARY.name()
                if app_s_data['status'] == "installed":
                    status_color = AppColors.SUCCESS.name()
                elif app_s_data['status'] == "getting":
                    status_color = AppColors.WARNING.name()

                version_label = QLabel(
                    f"Version: {app_data.get('version', 'N/A')}   |   Status: <b style='color:{status_color};'>{status_text}</b>")
                version_label.setFont(AppFonts.TEXT_SMALL)
                version_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()};")

                details_layout.addWidget(name_label)
                details_layout.addWidget(version_label)
                details_layout.addStretch()

                actions_layout = QHBoxLayout()
                actions_layout.setSpacing(12)
                button_style_sheet = f"""
                    QPushButton {{
                        border:none; border-radius: 7px; padding: 0 14px; font-weight: 600;
                    }}
                """

                # Example: "Open" button for installed apps (functionality not implemented)
                if app_s_data['status'] == 'installed':
                    open_button = QPushButton(f"▶️ Open")  # Using a play icon for "Open"
                    open_button.setFont(AppFonts.TEXT_SMALL)
                    open_button.setFixedHeight(34)
                    open_button.setCursor(Qt.PointingHandCursor)
                    open_button.setStyleSheet(button_style_sheet + f"""
                        QPushButton {{ background-color: {AppColors.ACCENT_PRIMARY.name()}; color: {AppColors.TEXT_ON_ACCENT.name()}; }}
                        QPushButton:hover {{ background-color: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
                    """)
                    open_button.setToolTip(f"Open {app_data['title']} (simulated)")
                    # open_button.clicked.connect(lambda _, ad=app_data: self.main_window.launch_app(ad)) # Placeholder
                    actions_layout.addWidget(open_button)

                remove_button = QPushButton("🗑️ Remove")  # Trash icon
                remove_button.setFont(AppFonts.TEXT_SMALL)
                remove_button.setFixedHeight(34)
                remove_button.setCursor(Qt.PointingHandCursor)
                remove_button.setStyleSheet(button_style_sheet + f"""
                    QPushButton {{ background-color: {AppColors.ERROR.darker(110).name()}; color: white; }} /* Slightly darker red */
                    QPushButton:hover {{ background-color: {AppColors.ERROR.name()}; }}
                """)
                remove_button.setToolTip(f"Remove {app_data['title']}")
                remove_button.clicked.connect(
                    lambda _, app_id_to_remove=app_data['id']: self.main_window.remove_app_from_my_apps(
                        app_id_to_remove))
                actions_layout.addWidget(remove_button)

                item_layout.addWidget(icon_label)
                item_layout.addLayout(details_layout)
                item_layout.addStretch(1)
                item_layout.addLayout(actions_layout)
                self.items_layout.addWidget(item_frame)  # Add the styled frame to the main layout

        self.items_layout.addStretch(1)  # Pushes items up


# --- Profile Page (Placeholder) ---
class ProfilePageWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)
        layout.setContentsMargins(40, 40, 40, 40)

        icon_label = QLabel(AppIcons.PROFILE)
        icon_label.setFont(QFont(AppFonts.FAMILY, 70))  # Larger icon
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet(f"color: {AppColors.ACCENT_PRIMARY.name()}; margin-bottom: 20px;")

        text_label = QLabel("Profile & Settings")
        text_label.setFont(AppFonts.TITLE_L)
        text_label.setAlignment(Qt.AlignCenter)
        text_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; margin-bottom: 10px;")

        coming_soon_label = QLabel("(Page Under Construction)")
        coming_soon_label.setFont(AppFonts.TEXT_DEFAULT)
        coming_soon_label.setAlignment(Qt.AlignCenter)
        coming_soon_label.setStyleSheet(f"color: {AppColors.TEXT_SECONDARY.name()};")

        layout.addWidget(icon_label)
        layout.addWidget(text_label)
        layout.addWidget(coming_soon_label)
        layout.addStretch()


# --- Main Window ---
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.all_apps_data = self._load_and_process_app_data()
        if self.all_apps_data is None:
            QTimer.singleShot(0, self.close)
            return

        self.my_apps_state = {}
        self.current_page_key = "Discover"  # Initial logical page
        self.category_filtered_page_key = "CategoryFilteredView"  # Specific key for this dynamic page type
        self.current_category_filter = None  # Track active category filter

        self.setWindowTitle("CyberSphere App Hub")
        self.resize(1440, 980)  # Slightly larger default size
        self.setMinimumSize(1024, 768)
        self.setStyleSheet(f"""
            QMainWindow {{ background-color: {AppColors.PRIMARY_BACKGROUND.name()}; }}
            QWidget {{
                font-family: '{AppFonts.FAMILY}';
                color: {AppColors.TEXT_PRIMARY.name()};
                font-size: {AppFonts.TEXT_DEFAULT.pointSize()}pt;
            }}
            QScrollArea {{ border: none; background-color: transparent; }}
            QScrollBar:vertical {{
                border: none; background: {AppColors.SECONDARY_BACKGROUND.name()};
                width: 14px; margin: 1px 1px 1px 1px; border-radius: 7px;
            }}
            QScrollBar::handle:vertical {{
                background: {AppColors.ACCENT_PRIMARY.name()}; min-height: 35px; border-radius: 7px;
            }}
            QScrollBar::handle:vertical:hover {{ background: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
            QScrollBar::handle:vertical:pressed {{ background: {AppColors.ACCENT_PRIMARY.darker(120).name()}; }}
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{ height: 0px; border: none; background: none; }}
            QScrollBar:horizontal {{
                border: none; background: {AppColors.SECONDARY_BACKGROUND.name()};
                height: 14px; margin: 1px 1px 1px 1px; border-radius: 7px;
            }}
            QScrollBar::handle:horizontal {{
                background: {AppColors.ACCENT_PRIMARY.name()}; min-width: 35px; border-radius: 7px;
            }}
            QScrollBar::handle:horizontal:hover {{ background: {AppColors.ACCENT_PRIMARY.lighter(120).name()}; }}
            QScrollBar::handle:horizontal:pressed {{ background: {AppColors.ACCENT_PRIMARY.darker(120).name()}; }}
            QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {{ width: 0px; border: none; background: none; }}
            QToolTip {{
                color: {AppColors.TEXT_PRIMARY.name()}; background-color: {AppColors.CONTENT_BACKGROUND_LIGHTER.name()};
                border: 1px solid {AppColors.ACCENT_PRIMARY.name()}; padding: 7px 9px; border-radius: 7px;
                font-size: {AppFonts.TEXT_SMALL.pointSize()}pt; opacity: 240;
            }}
            QTextEdit {{ /* Base style for QTextEdit, can be overridden by specific instances */
                background-color: {AppColors.CONTENT_BACKGROUND.name()};
                color: {AppColors.TEXT_PRIMARY.name()};
                border: 1px solid {AppColors.BORDER_COLOR.name()};
                border-radius: 8px;
                padding: 10px;
                selection-background-color: {AppColors.ACCENT_PRIMARY.name()};
                selection-color: {AppColors.TEXT_ON_ACCENT.name()};
            }}
            QMessageBox {{ /* Basic styling for QMessageBox */
                background-color: {AppColors.SECONDARY_BACKGROUND.name()};
            }}
            QMessageBox QLabel {{ /* Text inside QMessageBox */
                color: {AppColors.TEXT_PRIMARY.name()};
                font-size: {AppFonts.TEXT_DEFAULT.pointSize() + 1}pt;
            }}
            QMessageBox QPushButton {{ /* Buttons inside QMessageBox */
                background-color: {AppColors.ACCENT_PRIMARY.name()};
                color: {AppColors.TEXT_ON_ACCENT.name()};
                border: none; border-radius: 6px;
                padding: 8px 18px; margin-left: 10px;
                font-weight: 600;
            }}
            QMessageBox QPushButton:hover {{
                background-color: {AppColors.ACCENT_PRIMARY.lighter(120).name()};
            }}
        """)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_h_layout = QHBoxLayout(self.central_widget)
        self.main_h_layout.setContentsMargins(0, 0, 0, 0)
        self.main_h_layout.setSpacing(0)

        self._init_sidebar()
        self._init_stacked_widget()

        self.main_h_layout.addWidget(self.sidebar_frame)
        self.main_h_layout.addWidget(self.stacked_widget, 1)

        self.stacked_widget.setCurrentIndex(self.page_indices["Discover"])
        self.update_active_button("Discover")

    def _init_sidebar(self):
        self.sidebar_frame = QFrame()
        self.sidebar_frame.setFixedWidth(250)  # Slightly wider sidebar
        self.sidebar_frame.setObjectName("Sidebar")
        self.sidebar_frame.setStyleSheet(f"""
            QFrame#Sidebar {{
                background-color: {AppColors.SECONDARY_BACKGROUND.name()};
                border-right: 1px solid {AppColors.BORDER_COLOR.darker(120).name()};
            }}
            QPushButton#SidebarButton {{
                background-color: transparent;
                color: {AppColors.TEXT_SECONDARY.name()};
                padding: 13px 22px 13px 28px; /* LTRB padding */
                border: none; text-align: left;
                font-size: {AppFonts.TEXT_DEFAULT.pointSize() + 1}pt;
                font-weight: 500;
                border-left: 5px solid transparent; /* Thicker active indicator */
                transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; /* Smooth transition (might not work well on all styles) */
            }}
            QPushButton#SidebarButton:hover {{
                color: {AppColors.ACCENT_PRIMARY.lighter(110).name()};
                background-color: {AppColors.CONTENT_BACKGROUND.darker(105).name()};
            }}
            QPushButton#SidebarButton[active="true"] {{
                color: {AppColors.ACCENT_PRIMARY.name()};
                font-weight: 600; /* Bolder */
                border-left-color: {AppColors.ACCENT_PRIMARY.name()};
                background-color: {AppColors.PRIMARY_BACKGROUND.name()}; /* Match main background */
            }}
        """)
        sidebar_layout = QVBoxLayout(self.sidebar_frame)
        sidebar_layout.setContentsMargins(0, 25, 0, 25)
        sidebar_layout.setSpacing(8)
        sidebar_layout.setAlignment(Qt.AlignTop)

        app_title_label = QLabel("CyberSphere Hub")
        app_title_label.setFont(QFont(AppFonts.FAMILY, 18, QFont.Bold))  # More prominent title
        app_title_label.setAlignment(Qt.AlignCenter)
        app_title_label.setStyleSheet(f"color: {AppColors.TEXT_PRIMARY.name()}; padding: 15px 0 30px 0;")
        sidebar_layout.addWidget(app_title_label)

        self.sidebar_buttons = {}
        buttons_config = [
            (AppIcons.DISCOVER, "Discover", "Discover"),
            (AppIcons.CATEGORIES, "Categories", "Categories"),
            (AppIcons.MY_APPS, "My Library", "MyApps"),  # Renamed for clarity
        ]
        for icon, text, key in buttons_config:
            btn = QPushButton(f"{icon}  {text}")
            btn.setObjectName("SidebarButton")
            btn.setFixedHeight(52)
            btn.setProperty("page_key", key)
            btn.setCursor(Qt.PointingHandCursor)
            btn.setToolTip(f"Go to {text}")
            btn.clicked.connect(self.sidebar_button_clicked)
            sidebar_layout.addWidget(btn)
            self.sidebar_buttons[key] = btn

        sidebar_layout.addStretch(1)
        profile_btn = QPushButton(f"{AppIcons.PROFILE}  Profile")
        profile_btn.setObjectName("SidebarButton")
        profile_btn.setFixedHeight(52)
        profile_btn.setProperty("page_key", "Profile")
        profile_btn.setCursor(Qt.PointingHandCursor)
        profile_btn.setToolTip("Profile & Settings")
        profile_btn.clicked.connect(self.sidebar_button_clicked)
        sidebar_layout.addWidget(profile_btn)
        self.sidebar_buttons["Profile"] = profile_btn

    def _init_stacked_widget(self):
        self.stacked_widget = QStackedWidget()
        self.page_widgets = {}  # Stores actual widget instances

        self.discover_page = AppListPageWidget(self.all_apps_data, self)
        self.page_widgets["Discover"] = self.discover_page

        self.app_detail_page = AppDetailPageWidget(self)
        self.app_detail_page.getAppClickedInDetail.connect(self.handle_get_app_action)
        self.page_widgets["AppDetail"] = self.app_detail_page

        self.categories_page = CategoriesPageWidget(self.all_apps_data, self)
        self.categories_page.categorySelected.connect(self.show_category_filtered_page)
        self.page_widgets["Categories"] = self.categories_page

        self.my_apps_page = MyAppsPageWidget(self)
        self.page_widgets["MyApps"] = self.my_apps_page

        self.profile_page = ProfilePageWidget(self)
        self.page_widgets["Profile"] = self.profile_page

        self.page_indices = {
            "Discover": self.stacked_widget.addWidget(self.discover_page),
            "AppDetail": self.stacked_widget.addWidget(self.app_detail_page),
            "Categories": self.stacked_widget.addWidget(self.categories_page),
            "MyApps": self.stacked_widget.addWidget(self.my_apps_page),
            "Profile": self.stacked_widget.addWidget(self.profile_page),
            # The index for category_filtered_page_key will be added dynamically
        }
        # No initial index for self.category_filtered_page_key

    def _load_and_process_app_data(self):
        app_manifest_data = load_json_data('apps_manifest.json')
        file_info_data = load_json_data('file_info.json')
        if app_manifest_data is None or file_info_data is None: return None

        file_info_map = {info['name']: info for info in file_info_data}
        processed_data = []
        for app in app_manifest_data:
            merged_app_data = app.copy()
            file_details = file_info_map.get(app.get('file_name'))
            if file_details:
                merged_app_data.update(file_details)
            else:
                merged_app_data.setdefault('size_bytes', 0)
                merged_app_data.setdefault('last_updated', 'N/A')
            merged_app_data.setdefault('developer', 'Unknown Developer')
            merged_app_data.setdefault('icon', AppIcons.PLACEHOLDER)
            merged_app_data.setdefault('screenshots', [])
            processed_data.append(merged_app_data)
        return processed_data

    def sidebar_button_clicked(self):
        sender_button = self.sender()
        page_key = sender_button.property("page_key")

        if not page_key or page_key not in self.page_indices: return

        # If clicking the currently active page (and it's a list type), scroll to top
        if self.stacked_widget.currentIndex() == self.page_indices[page_key]:
            current_widget = self.page_widgets.get(page_key)
            if isinstance(current_widget, (AppListPageWidget, CategoriesPageWidget, MyAppsPageWidget)):
                if hasattr(current_widget, "scroll_area"):
                    current_widget.scroll_area.verticalScrollBar().setValue(0)
            return  # Don't reload same page

        self.stacked_widget.setCurrentIndex(self.page_indices[page_key])
        self.current_page_key = page_key  # Update logical page key
        self.update_active_button(page_key)

        # Specific actions on page switch
        if page_key == "MyApps":
            self.my_apps_page.refresh_my_apps_display()
        elif page_key == "Discover" and hasattr(self.discover_page, 'update_all_card_buttons'):
            self.discover_page.update_all_card_buttons()
            if hasattr(self.discover_page, "scroll_area"): self.discover_page.scroll_area.verticalScrollBar().setValue(
                0)
        elif page_key == "Categories" and hasattr(self.categories_page, "scroll_area"):
            self.categories_page.scroll_area.verticalScrollBar().setValue(0)

    def update_active_button(self, active_page_key):
        for key, button in self.sidebar_buttons.items():
            is_active = (key == active_page_key)
            button.setProperty("active", is_active)
            button.style().unpolish(button)
            button.style().polish(button)

    def show_app_detail_page(self, app_data, came_from_key=None):
        self.app_detail_page.set_app_data(app_data)
        self.stacked_widget.setCurrentIndex(self.page_indices["AppDetail"])
        self.current_page_key = "AppDetail"  # Set logical key AFTER switch
        # Keep the source sidebar button active if provided, otherwise, no sidebar button is "active"
        self.update_active_button(came_from_key if came_from_key in self.sidebar_buttons else None)

    def show_category_filtered_page(self, category_name):
        # If already showing this category, scroll to top
        if self.current_page_key == self.category_filtered_page_key and \
                self.current_category_filter == category_name and \
                self.category_filtered_page_key in self.page_widgets:
            page = self.page_widgets[self.category_filtered_page_key]
            if hasattr(page, "scroll_area"):
                page.scroll_area.verticalScrollBar().setValue(0)
            self.update_active_button("Categories")  # Ensure "Categories" is active
            return

        # Remove previous filtered page widget if it exists
        if self.category_filtered_page_key in self.page_indices and self.page_indices[
            self.category_filtered_page_key] != -1:
            old_widget_idx = self.page_indices[self.category_filtered_page_key]
            if old_widget_idx < self.stacked_widget.count() and old_widget_idx >= 0:
                old_widget = self.stacked_widget.widget(old_widget_idx)
                if old_widget:
                    self.stacked_widget.removeWidget(old_widget)
                    old_widget.deleteLater()
            # Invalidate the old index and widget reference
            self.page_indices.pop(self.category_filtered_page_key, None)
            self.page_widgets.pop(self.category_filtered_page_key, None)

        # Create and add new filtered page
        filtered_page = AppListPageWidget(self.all_apps_data, self,
                                          filter_category=category_name,
                                          initial_search_term="")  # Reset search on category change

        new_index = self.stacked_widget.addWidget(filtered_page)
        self.page_widgets[self.category_filtered_page_key] = filtered_page
        self.page_indices[self.category_filtered_page_key] = new_index

        self.stacked_widget.setCurrentIndex(new_index)
        self.current_page_key = self.category_filtered_page_key  # Update logical page key
        self.current_category_filter = category_name
        self.update_active_button("Categories")  # Keep Categories sidebar active

    def navigate_from_breadcrumb(self, page_identifier):
        target_index = -1
        target_key = None

        if isinstance(page_identifier, str):  # It's a page key
            target_key = page_identifier
            target_index = self.page_indices.get(target_key)
            if target_index is None and target_key == self.category_filtered_page_key:  # Special case for dynamic page
                target_index = self.page_indices.get(self.category_filtered_page_key)
        elif isinstance(page_identifier, int) and page_identifier != -1:  # It's an index
            target_index = page_identifier
            for key, idx_val in self.page_indices.items():
                if idx_val == target_index:
                    target_key = key
                    break

        if target_index is not None and target_index >= 0 and target_index < self.stacked_widget.count():
            self.stacked_widget.setCurrentIndex(target_index)
            self.current_page_key = target_key if target_key else f"Index_{target_index}"

            active_sidebar_key = None
            if target_key in self.sidebar_buttons:
                active_sidebar_key = target_key
            elif target_key == self.category_filtered_page_key:
                active_sidebar_key = "Categories"  # If navigating to filtered list, keep Categories active
            self.update_active_button(active_sidebar_key)

            # Refresh/update content if necessary
            page_widget = self.stacked_widget.widget(target_index)
            if hasattr(page_widget, 'update_all_card_buttons'):
                page_widget.update_all_card_buttons()
            if hasattr(page_widget, "scroll_area"):
                page_widget.scroll_area.verticalScrollBar().setValue(0)
        elif page_identifier == -1:  # Non-clickable crumb (current page), do nothing
            pass

    def get_app_status(self, app_id):
        return self.my_apps_state.get(app_id, {}).get("status", "available")

    def handle_get_app_action(self, app_data, button_ref):
        app_id = app_data["id"]
        if app_data.get("isDecoy"):
            decoy_url = app_data.get("decoyUrl", "https_example.com")  # Make sure it's a valid URL for testing
            QDesktopServices.openUrl(QUrl(decoy_url))
            QMessageBox.information(self, "Opening Link", f"Opening link for {app_data['title']} in your browser.")
            return

        current_status = self.get_app_status(app_id)
        if current_status == "available":
            self.my_apps_state[app_id] = {"status": "getting", "data": app_data, "button_ref": button_ref}
            self.update_button_visuals(app_id)
            QMessageBox.information(self, "Acquiring App", f"Simulating acquisition of '{app_data['title']}'...")
            QTimer.singleShot(2000, lambda: self.finish_getting_app(app_id))
        elif current_status == "installed":
            QMessageBox.information(self, "App Installed", f"'{app_data['title']}' is already in your library.")

    def finish_getting_app(self, app_id):
        if app_id in self.my_apps_state:
            self.my_apps_state[app_id]["status"] = "installed"
            self.update_button_visuals(app_id)
            QMessageBox.information(self, "Acquisition Complete",
                                    f"'{self.my_apps_state[app_id]['data']['title']}' is now in your library.")
            if self.current_page_key == "MyApps":  # If My Apps page is active
                self.my_apps_page.refresh_my_apps_display()

    def update_button_visuals(self, app_id):
        # Update card button on any AppListPageWidget currently visible
        current_widget = self.stacked_widget.currentWidget()
        if isinstance(current_widget, AppListPageWidget) and hasattr(current_widget, 'cards'):
            for card in current_widget.cards:
                if card.app_data['id'] == app_id:
                    card.update_button_state()
                    break

        # Update detail page button if it's active and showing this app
        if current_widget == self.app_detail_page and self.app_detail_page.app_data and self.app_detail_page.app_data[
            'id'] == app_id:
            self.app_detail_page.update_detail_button_state()

        # If My Apps page is visible, refresh it (e.g. if an app was removed elsewhere changing its status)
        # This is more for comprehensive state updates, might be redundant if status changes only happen via "MyApps"
        # if current_widget == self.my_apps_page:
        #     self.my_apps_page.refresh_my_apps_display()

    def remove_app_from_my_apps(self, app_id_to_remove):
        if app_id_to_remove in self.my_apps_state:
            app_title = self.my_apps_state[app_id_to_remove]['data']['title']
            reply = QMessageBox.question(self, "Confirm Removal",
                                         f"Are you sure you want to remove '{app_title}' from your library?",
                                         QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
            if reply == QMessageBox.Yes:
                del self.my_apps_state[app_id_to_remove]
                self.update_button_visuals(app_id_to_remove)  # Revert buttons to "Get" on other pages
                if self.stacked_widget.currentWidget() == self.my_apps_page:
                    self.my_apps_page.refresh_my_apps_display()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    # Forcing Fusion style can help with QSS consistency on some platforms
    # app.setStyle("Fusion")

    # Apply a global font if desired, but individual widget fonts are more specific
    # global_font = QFont(AppFonts.FAMILY, AppFonts.TEXT_DEFAULT.pointSize())
    # app.setFont(global_font)

    window = MainWindow()
    if window.all_apps_data is not None:
        window.show()
        sys.exit(app.exec_())
    else:
        sys.exit(1)