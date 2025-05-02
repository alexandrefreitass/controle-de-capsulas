from rest_framework import routers
from .views import ProdutoViewSet, FormulaViewSet, IngredienteViewSet

router = routers.DefaultRouter()
router.register(r"produtos", ProdutoViewSet)
router.register(r"formulas", FormulaViewSet)
router.register(r"ingredientes", IngredienteViewSet)

urlpatterns = router.urls
